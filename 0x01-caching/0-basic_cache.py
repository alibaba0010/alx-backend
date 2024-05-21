#!/usr/bin/python3
"""
    BaseCache module
"""

from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """ BasicCache define a intro to use cache
    """

    def put(self, key, item):
        """
            modify cache data

            Args:
                key: of the dict
                item: value of the key
        """
        if key or item is not None:
            self.cache_data[key] = item

    def get(self, key):
        """
            modify cache data

            Args:
                key: of the dict

            Return:
                value of the key
        """

        valuecache = self.cache_data.get(key)
        return valuecache
