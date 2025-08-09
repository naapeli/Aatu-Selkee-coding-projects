def climb_stairs(n: int) -> int:
    if n == 1:
        return 1
    elif n == 2:
        return 2
    else:
        return climb_stairs(n - 2) + climb_stairs(n - 1)


# better solution using memory to store already calculated values

def climb_stairs_2(n: int) -> int:
    memory = [0, 1, 2]

    def climb(n: int) -> int:
        if n <= len(memory) - 1:
            return memory[n]
        else:
            memory.insert(n, climb(n - 1) + climb(n - 2))
            return memory[n]
    return climb(n)


print(climb_stairs(30))
print(climb_stairs_2(30))
print(climb_stairs_2(999))
# print(climb_stairs_2(1000)) recursion too long for Python
