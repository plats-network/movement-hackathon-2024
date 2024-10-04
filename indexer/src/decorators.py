import json
from functools import wraps
from src.extensions import redis_client


def get_cache_key(*args, **kwargs):
    key = ""
    # First args
    for i in args:
        if isinstance(i, type):
            continue
        key += ":%s" % i

    # Attach any kwargs
    for k in sorted(kwargs):
        key += ":{}|{}".format(k, kwargs[k])

    return key


def cache_filter(timeout=86400, key_prefix='plat_movement:indexer', is_class=False, include_null=False):
    """
    Decorator for caching functions by filter
    Returns the cached value, or the function if the cache is disabled
    """
    if timeout is None:
        timeout = 86400

    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            if is_class:
                key = "%s:%s%s" % (key_prefix, f.__name__,
                                   get_cache_key(*args[1:], **kwargs))
            else:
                key = "%s:%s%s" % (key_prefix, f.__name__,
                                   get_cache_key(*args, **kwargs))

            output = redis_client.get(key)

            if output:
                # print('HIT', key)
                return json.loads(output)

            output = f(*args, **kwargs)

            if output or include_null:
                # print('MISS', key, output)
                # Set data to redis
                redis_client.setex(
                    key, timeout,
                    json.dumps(output)
                )

            return output

        return wrapper

    return decorator
