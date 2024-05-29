#!/usr/bin/python3
"""
    BaseCache module
"""

from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """ LRUCache define a LRU algorithm to use cache
    """

    def __init__(self):
        """ Initiliaze
        """
        super().__init__()
        self.leastrecent = []

    def put(self, key, item):
        """
            modify cache data

            Args:
                key: of the dict
                item: value of the key
        """
        if key or item is not None:
            valuecache = self.get(key)
            # Make a new
            if valuecache is None:
                if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                    keydel = self.leastrecent
                    lendel = len(keydel) - 1
                    del self.cache_data[keydel[lendel]]
                    print("DISCARD: {}".format(self.leastrecent.pop()))
            else:
                del self.cache_data[key]

            if key in self.leastrecent:
                idxtodel = self.search_first(self.leastrecent, key)
                self.leastrecent.pop(idxtodel)
                self.leastrecent.insert(0, key)
            else:
                self.leastrecent.insert(0, key)

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

        if valuecache:
            idxtodel = self.search_first(self.leastrecent, key)
            self.leastrecent.pop(idxtodel)
            self.leastrecent.insert(0, key)

        return valuecache

    @staticmethod
    def search_first(mrulist, key):
        for i in range(0, len(mrulist)):
            if mrulist[i] == key:
                return (i)

        return None
