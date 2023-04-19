def generate(num_of_rows: int):
    pascal = [[1]]
    while len(pascal) < num_of_rows:
        new_entry = [1]
        for index, value in enumerate(pascal[-1]):
            if index < len(pascal[-1]) - 1:
                new_entry.append(value + pascal[-1][index + 1])
            else:
                new_entry.append(1)
        pascal.append(new_entry)
    return pascal


print(generate(5))
