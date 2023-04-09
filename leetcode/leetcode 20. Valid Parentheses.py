def is_valid(s: str):
    def transform(brackets: str):
        return brackets.replace("()", "").replace("{}", "").replace("[]", "")
    new_string = s
    old_string = "placeholder"
    while new_string != "" and new_string != old_string:
        old_string = new_string
        new_string = transform(new_string)
    return new_string == ""


print(is_valid("()"))
print(is_valid("()[]{}"))
print(is_valid("(]"))
