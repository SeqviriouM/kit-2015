<html>
    <head>
        <meta charset="utf-8">
    </head>
<script>
/**
 * Реализация API, не изменяйте ее
 * @param {string} url
 * @param {function} callback
 */
function getData(url, callback) {
    var RESPONSES = {
        '/countries': [
            {name: 'Cameroon', continent: 'Africa'},
            {name :'Fiji Islands', continent: 'Oceania'},
            {name: 'Guatemala', continent: 'North America'},
            {name: 'Japan', continent: 'Asia'},
            {name: 'Yugoslavia', continent: 'Europe'},
            {name: 'Tanzania', continent: 'Africa'}
        ],
        '/cities': [
            {name: 'Bamenda', country: 'Cameroon'},
            {name: 'Suva', country: 'Fiji Islands'},
            {name: 'Quetzaltenango', country: 'Guatemala'},
            {name: 'Osaka', country: 'Japan'},
            {name: 'Subotica', country: 'Yugoslavia'},
            {name: 'Zanzibar', country: 'Tanzania'},
        ],
        '/populations': [
            {count: 138000, name: 'Bamenda'},
            {count: 77366, name: 'Suva'},
            {count: 90801, name: 'Quetzaltenango'},
            {count: 2595674, name: 'Osaka'},
            {count: 100386, name: 'Subotica'},
            {count: 157634, name: 'Zanzibar'}
        ]
    };
    setTimeout(function () {
        var result = RESPONSES[url];
        if (!result) {
            return callback('Unknown url');
        }
        callback(null, result);
    }, Math.round(Math.random * 1000));
}

/**
 * Ваши изменения ниже
 */

(function () {
    var requests = ['/countries', '/cities', '/populations'],
        responses = {},
        target = prompt("Введите название интересующей страны или города:");     

        var getPopulation = function (targetName, data) {
            if (targetName) {
                var town, country, population;
                
                town = data['/populations'].filter(function (item, index) {
                    return item.name.toLowerCase() === target.toLowerCase();
                });

                if (town.length !== 0) {
                    return 'Total population in town ' + target + ': ' + town[0].count;
                } 

                country = data['/cities'].filter(function (item, index) {
                    return item.country.toLowerCase() === target.toLowerCase();
                });

                if (country.length !== 0) {
                    town = data['/populations'].filter(function (item, index) {
                        return item.name.toLowerCase() === country[0].name.toLowerCase(); 
                    });

                    population = town.reduce(function (res, curr) {
                        return res + curr.count;
                    }, 0);

                    return 'Total population in country ' + target + ': ' + population;

                }

                return 'Sorry, we haven\'t information about this town/country: ' + target; 
            } else {
                var countries = data['/countries'].map(function (item, index) {
                    return (item.continent === 'Africa') ? item.name  : '';
                }).filter(function (item, index) { 
                    return item !== '' 
                });

                var cities = data['/cities'].map(function (item, index) {
                    return (countries.indexOf(item.country) !== -1) ? item.name : '';
                }).filter(function (item, index) { 
                    return item !== '' 
                });

                var population = data['/populations'].reduce(function (res, curr) {
                    if (cities.indexOf(curr.name) !== -1) {
                        res += curr.count;
                    }
                    return res;
                }, 0);

                return 'Total population in African cities: ' + population;
            }

            
        }

        requests.forEach(function (requestUrl, index) {
            getData(requestUrl, function (error, result) {
                if (error) {
                    console.log(error);
                } else {
                    responses[requestUrl] = result;
                }

                if (Object.keys(responses).length === 3) {
                    var result = getPopulation(target, responses);
                    console.log(result);
                }
            })
        })
})(); 

</script>
</html>
