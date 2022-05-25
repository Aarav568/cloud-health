#include "coherence/lang.ns"

#include "coherence/net/cache/ContinuousQueryCache.hpp"
include "coherence/net/CacheFactory.hpp"
#include "coherence/net/NamedCache.hpp"
#include "coherence/stl/boxing_map.hpp"
#include "coherence/util/aggregator/ComparableMin.hpp"
#include "coherence/util/extractor/IdentityExtractor.hpp"
#include "coherence/util/filter/GreaterFilter.hpp"
#include "coherence/util/processor/NumberIncrementor.hpp"
#include "coherence/util/Iterator.hpp"
#include "coherence/util/Filter.hpp"
#include "coherence/util/Set.hpp"
#include "coherence/util/ValueExtractor.hpp"
#include "coherence/util/ValueManipulator.hpp"

#include "VerboseMapListener.hpp"

#include <iostream>

using namespace coherence::lang;

using coherence::examples::VerboseMapListener;
using coherence::net::cache::ContinuousQueryCache;
sing coherence::net::CacheFactory;
using coherence::net::NamedCache;
using coherence::stl::boxing_map;
using coherence::util::aggregator::ComparableMin;
using coherence::util::extractor::IdentityExtractor;
using coherence::util::filter::GreaterFilter;
using coherence::util::processor::NumberIncrementor;
using coherence::util::Iterator;
using coherence::util::Filter;
using coherence::util::Set;
using coherence::util::ValueExtractor;
using coherence::util::ValueManipulator;


/**
* This example demonstrates the basics of accessing a cache by using the
* Coherence C++ API.
*
* @argc  the number of command line arguments (including the process name)
* @argv  [cache-name]
*/
int main(int argc, char** argv)
    {
    try
        {
        // read optional cache name from command line
        String::View vsCacheName = argc > 1 ? argv[1] : "dist-hello";

        // retrieve the named cache
        NamedCache::Handle hCache = CacheFactory::getCache(vsCacheName);
        std::cout << "retrieved cache \"" << hCache->getCacheName()
                  << "\" containing " << hCache->size() << " entries"
                  << std::endl;

        // create a key, and value
        String::View vsKey   = "hello";
        String::View vsValue = "grid";

        // insert the pair into the cache
        hCache->put(vsKey, vsValue);
        std::cout << "\tput: " << vsKey << " = " << vsValue << std::endl;

        // read back the value, casting to the expected value type
        String::View vsGet = cast<String::View>(hCache->get(vsKey));
        std::cout << "\tget: " << vsKey << " = " << vsGet << std::endl;

        // read a non-existent entry from the cache; result will be NULL
        String::View vsKeyDummy = "dummy";
        Object::View vDummy     = hCache->get(vsKeyDummy);
        std::cout << "\tget: " << vsKeyDummy << " = " << vDummy << std::endl;

        // work with non-string data types
        hCache->put(Integer32::valueOf(12345), Float64::valueOf(6.7));
        hCache->put(Integer32::valueOf(23456), Float64::valueOf(7.8));
        hCache->put(Integer32::valueOf(34567), Float64::valueOf(8.9));

        // iterate and print the cache contents, treating contents abstractly
        std::cout << "entire cache contents:" << std::endl;
        for (Iterator::Handle hIter = hCache->entrySet()->iterator();
             hIter->hasNext(); )
            {
            Map::Entry::View vEntry = cast<Map::Entry::View>(hIter->next());
            Object::View     vKey   = vEntry->getKey();
            Object::View     vValue = vEntry->getValue();
            std::cout << '\t' << vKey << " = " << vValue << std::endl;
            }

        // remove strings to make the cache contents uniform
        hCache->remove(vsKey);

        // caches may also be wrapped with an STL-like map adapter
        typedef boxing_map<Integer32, Float64> float_cache;
        float_cache cache(hCache);
        cache[45678] = 9.1;
        std::cout << "updated cache contents:" << std::endl;
        for (float_cache::iterator i = cache.begin(), e = cache.end(); i != e;++i)
            {
            std::cout << '\t' << i->first << " = " << i->second << std::endl;
            }

        // perform aggregation, and print the results
        ValueExtractor::View vExtractor = IdentityExtractor::getInstance();
        Float64::View        vFlMin     = cast<Float64::View>(
                hCache->aggregate((Filter::View) NULL,
                ComparableMin::create(vExtractor)));
        std::cout << "minimum: " << vFlMin << std::endl;

        // query the cache, and print the results
        Filter::View vFilter    = GreaterFilter::create(vExtractor,
                                                  Float64::valueOf(7.0));
        Set::View    vSetResult = hCache->entrySet(vFilter);

        std::cout << "filtered cache contents by " << vFilter << std::endl;
        for (Iterator::Handle hIter = vSetResult->iterator(); hIter->hasNext(); )
            {
            Map::Entry::View vEntry = cast<Map::Entry::View>(hIter->next());
            Object::View     vKey   = vEntry->getKey();
            Object::View     vValue = vEntry->getValue();
            std::cout << '\t' << vKey << " = " << vValue << std::endl;
            }

        // present a real-time filtered view of the cache
        NamedCache::Handle hCacheCqc =
            ContinuousQueryCache::create(hCache, vFilter);
        std::cout << "ContinuousQueryCache filtered view: " << std::endl;
        for (Iterator::Handle hIter = hCacheCqc->entrySet()->iterator();
             hIter->hasNext(); )
            {
            Map::Entry::View vEntry = cast<Map::Entry::View>(hIter->next());
            Object::View     vKey   = vEntry->getKey();
            Object::View     vValue = vEntry->getValue();
            std::cout << '\t' << vKey << " = " << vValue << std::endl;
            }

        // register MapListener to print changes to stdout
        std::cout << "start listening to events..." << std::endl;
        hCache->addFilterListener(VerboseMapListener::create());

        // invoke entry processor on matchingcache contents, incrementing each
        // value by the minimum value
        Float64::Handle vFlIncr = Float64::valueOf(1.0);
        std::cout << "increment results by " << vFlIncr << std::endl;
        hCacheCqc->invokeAll((Filter::View) NULL, NumberIncrementor::create(
                (ValueManipulator::View) NULL, vFlIncr, /*fPost*/ true));

        // disconnect from the grid
        CacheFactory::shutdown();
        }
    catch (const std::exception& e)
        {
        std::cerr << "error: " << e.what() << std::endl;
        return 1;
        }
    return 0;
    }