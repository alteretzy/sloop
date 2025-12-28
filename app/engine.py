import httpx
from bs4 import BeautifulSoup
from .models import ProductVariant
import random
import re

# We need to look like a real browser, or we get blocked instantly.
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
}

async def scrape_ebay(query: str) -> list[ProductVariant]:
    """
    Searches eBay for the query and returns the top 3 results.
    """
    # 1. Construct the Search URL
    formatted_query = query.replace(" ", "+")
    url = f"https://www.ebay.com/sch/i.html?_nkw={formatted_query}&_sacat=0"

    print(f"🔎 Scraping eBay URL: {url}")

    async with httpx.AsyncClient() as client:
        try:
            # 2. Make the Network Request
            response = await client.get(url, headers=HEADERS, timeout=10.0)
            
            if response.status_code != 200:
                print(f"❌ eBay blocked us: {response.status_code}")
                return []

            # 3. Parse the HTML
            soup = BeautifulSoup(response.text, "lxml")
            
            # eBay's item container class (this changes rarely, but can change!)
            # As of late 2025, items are usually in 'div.s-item__info'
            items = soup.select(".s-item__info")
            
            variants = []
            
            # 4. Extract Data from the first 3 valid results
            for item in items[:4]: 
                # Skip the "Shop on eBay" header item which often has this class
                title_el = item.select_one(".s-item__title")
                if not title_el or "Shop on eBay" in title_el.text:
                    continue

                price_el = item.select_one(".s-item__price")
                link_el = item.select_one("a.s-item__link")
                
                if title_el and price_el and link_el:
                    title = title_el.text.strip()
                    price_str = price_el.text.strip()
                    link = link_el["href"]

                    # CLEANING THE PRICE: eBay returns "$120.00" or "$100.00 to $150.00"
                    # We regex to find the first number.
                    price_match = re.search(r"[\d,.]+", price_str)
                    if price_match:
                        price_val = float(price_match.group().replace(",", ""))
                        
                        variants.append(ProductVariant(
                            vendor="eBay Seller",
                            price=price_val,
                            url=link,
                            in_stock=True,
                            shipping_time="Varies"
                        ))

            return variants

        except Exception as e:
            print(f"❌ Scraping Error: {e}")
            return []

async def aggregate_prices(query: str):
    """
    The Master Function that orchestrates the scraping.
    """
    print(f"🕷️ Starting scrape for: {query}")
    
    # 1. Get Real Data from eBay
    ebay_results = await scrape_ebay(query)
    
    # 2. Add a "Control" Price (e.g., Sloop Direct) so we always have comparison data
    # (Since we aren't actually scraping Amazon/Nike yet to keep complexity low)
    base_price = ebay_results[0].price if ebay_results else 100.00
    
    sloop_direct = ProductVariant(
        vendor="SloopDirect",
        price=round(base_price * 0.85, 2), # We are always 15% cheaper ;)
        url="https://sloop.app",
        in_stock=True,
        shipping_time="5 Days"
    )
    
    results = ebay_results + [sloop_direct]
    
    return results