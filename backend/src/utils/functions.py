import datetime as dt
import pytz
import hashlib
import random

def tzware_datetime():
    """
    Return a timezone aware datetime.

    :return: Datetime
    """
    return dt.datetime.now(pytz.utc)

def generate_hash(data):
    """
    Generate a hash from the given data.

    :param data: Data to hash
    :return: Hash
    """
    data = data + tzware_datetime().isoformat()
    return hashlib.sha256(data.encode()).hexdigest()


def random_in_range(min_value: float, max_value: float) -> float:
    return random.uniform(min_value, max_value)

if __name__ == '__main__':
    print(random_in_range(1, 10))