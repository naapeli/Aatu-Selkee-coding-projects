def swap(a, i, j):
    a[i], a[j] = a[j], a[i]

def partition(a, lo, hi, pivotIndex):
    pivotValue = a[pivotIndex]
    swap(a, pivotIndex, hi)
    storeIndex = lo
    equalIndex = lo
    for i in range(lo, hi):
        if a[i] < pivotValue:
            swap(a, storeIndex, i)
            storeIndex += 1
            equalIndex += 1
        elif a[i] == pivotValue:
            swap(a, equalIndex, i)
            equalIndex += 1
    swap(a, equalIndex, hi)
    return (storeIndex, equalIndex)

print(partition([8, 7, 6, 3, 4, 5, 5, 5, 5, 5, 6, 7, 8], 0, len([1, 1, 2, 3, 4, 5, 5, 5, 5, 5, 6, 7, 8]) - 1, 6))
