from typing import List
from math import pow

# own first solution


def plus_one(digits: List[int]) -> List[int]:
    n = 1
    if digits[-1] == 9:
        while n <= len(digits) and digits[-n] == 9:
            digits[-n] = 0
            n += 1
        if sum(digits) == 0:
            digits.insert(0, 1)
        else:
            digits[-n] += 1
    else:
        digits[-1] += 1
    return digits


# own second solution


def plus_one_2(digits: List[int]) -> List[int]:
    number = 0
    result = []
    for index in range(len(digits)):
        n = len(digits) - index - 1
        number += int(pow(10, n) * digits[index])
    number += 1
    for num in str(number):
        result += num
        result = list(map(int, result))
    return result


print(plus_one([1, 2, 3]))
print(plus_one([1, 2, 3, 4]))
print(plus_one([1, 2, 3, 9]))
print(plus_one([1, 9, 9, 9]))
print(plus_one([9, 9, 9, 9]))

print(plus_one_2([1, 2, 3]))
print(plus_one_2([1, 2, 3, 4]))
print(plus_one_2([1, 2, 3, 9]))
print(plus_one_2([1, 9, 9, 9]))
print(plus_one_2([9, 9, 9, 9]))
