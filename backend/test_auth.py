from src.auth import register_user, login_user, verify_token


print("\n========== TEST 1 : NORMAL REGISTER ==========\n")

r = register_user(
    "test@medbot.com",
    "password123",
    "Dr Test"
)

print(r)


print("\n========== TEST 2 : DUPLICATE EMAIL ==========\n")

duplicate = register_user(
    "test@medbot.com",
    "password123",
    "Dr Test"
)

print(duplicate)


print("\n========== TEST 3 : SHORT PASSWORD ==========\n")

short_pass = register_user(
    "new@medbot.com",
    "123",
    "New User"
)

print(short_pass)


print("\n========== TEST 4 : NORMAL LOGIN ==========\n")

login = login_user(
    "test@medbot.com",
    "password123"
)

print(login)


print("\n========== TEST 5 : WRONG PASSWORD ==========\n")

wrong = login_user(
    "test@medbot.com",
    "wrongpassword"
)

print(wrong)


print("\n========== TEST 6 : TOKEN VERIFY ==========\n")

token = login["token"]

verify = verify_token(token)

print(verify)