def max_profit(prices: list[int]):
    current_max_profit = 0
    for index, price1 in enumerate(prices):
        for price2 in prices[index:]:
            if price2 - price1 > current_max_profit:
                current_max_profit = price2 - price1
    return current_max_profit


def max_profit_2(prices: list[int]):
    current_max_profit, minimum_price = 0, float("inf")
    for price in prices:
        minimum_price = min(minimum_price, price)
        current_max_profit = max(current_max_profit, price - minimum_price)
    return current_max_profit


print(max_profit([7, 1, 5, 3, 6, 4]))
print(max_profit([7, 6, 4, 3, 1]))
print(max_profit_2([7, 1, 5, 3, 6, 4]))
print(max_profit_2([7, 6, 4, 3, 1]))
