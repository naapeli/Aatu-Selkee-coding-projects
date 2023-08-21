from math import floor


# Newton's method

def sqrt(y: float) -> int:
    if x == 0: return 0
    a = 0.00001
    x_prev = 1
    x_new = x
    while abs(x_new - x_prev)/x_prev > a:
        x_prev = x_new
        x_new = x_prev - (x_prev ** 2 - x)/(2 * x_prev)
    return floor(x_new)


# binary search

def sqrt_2(y: float) -> int:
    a = 0.01
    area = [0, y]
    while area[1] - area[0] >= a:
        mid = (area[1] + area[0]) / 2
        if mid ** 2 <= y:
            area[0] = mid
        else:
            area[1] = mid
    return floor(area[1])


print(sqrt(2))
print(sqrt(4))
print(sqrt(100019999))

print(sqrt_2(2))
print(sqrt_2(4))
print(sqrt_2(100019999))
