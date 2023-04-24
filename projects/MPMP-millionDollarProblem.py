def test(a, b):
    balance = a + b
    previous_balance = a
    counter = 2
    while balance < 1000000:
        new_previous_balance = balance
        balance = balance + previous_balance
        previous_balance = new_previous_balance
        counter += 1
    if balance == 1000000:
        return counter
    else:
        return -1


def run_test(cap):
    largest_so_far = (0, 0, 0)
    for a in range(1, cap):
        for b in range(1, cap):
            length = test(a, b)
            if length > largest_so_far[0]:
                largest_so_far = (length, a, b)

    return largest_so_far


print(run_test(2000))

# largest amount of days is 19, for which the first deposit is 144 $ and the second deposit is 154 $
