import re

def collect_consecutive_messages(data_file):
	cleaned_data = []

	date_time = r"(\d+\.\d+\.\d+\s\d+\.\d+)"
	dash_whitespace = r"\s-\s"
	username = r"([\w\s]+)"
	metadata_end = r":\s"
	pattern = date_time + dash_whitespace + username + metadata_end

	with open(data_file, "r") as data:
		content = data.read()

		previous_date = ""
		previous_messenger = ""
		previous_message = ""
		for message in content:
			print(message)
			if "<Media jätettiin pois>" in message:
				continue
			if message[0:5] == previous_date and message[18:22] == previous_messenger:
				previous_message = previous_message + re.sub(pattern, "", message)
			else:
				previous_date = message[0:5]
				previous_messenger = message[18:22]
				cleaned_data.append(re.sub(pattern, "", message))
				previous_message = ""

	return cleaned_data

collect_consecutive_messages("data.txt")