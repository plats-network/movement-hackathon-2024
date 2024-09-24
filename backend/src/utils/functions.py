import datetime as dt
import pytz
import hashlib


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


if __name__ == '__main__':
    print(generate_hash("plat_app"))