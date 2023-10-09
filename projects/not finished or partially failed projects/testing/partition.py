import random

# works but partition method could be faster, implemented in the final solution
def swap(a, i, j):
    a[i], a[j] = a[j], a[i]

def partition(a, lo, hi, pivotIndex):
    pivotValue = a[pivotIndex]
    swap(a, pivotIndex, hi)
    storeIndex = lo
    for i in range(lo, hi):
        if a[i] < pivotValue:
            swap(a, storeIndex, i)
            storeIndex += 1
    firstPivotIndex = storeIndex
    for i in range(storeIndex, hi + 1):
        if a[i] == pivotValue:
            swap(a, storeIndex, i)
            storeIndex += 1
    return (firstPivotIndex, storeIndex - 1)

def select(a, lo, hi, k):
    if lo == hi:
        return a[lo]
    pivotIndex = lo + random.randint(0, hi - lo)
    print(a)
    left, right = partition(a, lo, hi, pivotIndex)
    print(pivotIndex, a, hi - lo, lo, hi, left, right)
    if left <= k and k <= right:
        return a[k]
    elif k < left:
        print("here")
        return select(a, lo, left - 1, k)
    else:
        print("there")
        return select(a, right + 1, hi, k)
  
    return select(a, 0, len(a) - 1, k)


print(select([30, 26, 87, 35, 60, 87, 68, 95], 0, len([30, 26, 87, 35, 60, 87, 68, 95]) - 1, 5))
print(select([14, 76, 92, 65, 90, 32, 66, 94, 98, 81, 43, 43, 15, 18, 60, 29, 76, 38, 39, 32, 66, 46, 48, 92, 24, 79], 0, len([14, 76, 92, 65, 90, 32, 66, 94, 98, 81, 43, 43, 15, 18, 60, 29, 76, 38, 39, 32, 66, 46, 48, 92, 24, 79]) - 1, 15))
