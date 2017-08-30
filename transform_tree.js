//scr-scr-scratch!!!

/*
var sampleStats1 = [
    {name:"adm/a1.asp", loc:12, inc:["inc1.asp", "inc2.asp", "adm/inc3.asp"]},
    {name:"inc1.asp", loc:12, inc:["adm/inc3.asp"]},
    {name:"inc2.asp", loc:12, inc:[]},
    {name:"adm/inc3.asp", loc:12, inc:[]},

];

var expectedTree = [
    {
        name:"adm/a1.asp",
        inc:[
            {
                name : "inc1.asp",
                inc:[
                    {
                        name : "adm/inc3.asp",
                        inc:[]
                    }
                ]
            },
            {
                name : "inc2.asp",
                inc:[]
            },
            {
                name : "adm/inc3.asp",
                inc:[]
            }
        ]
    },
    {
        name : "inc1.asp",
        inc:[
            {
                name : "adm/inc3.asp",
                inc:[]
            }
        ]
    },
    {
        name : "inc2.asp",
        inc:[]
    },
    {
        name : "adm/inc3.asp",
        inc:[]
    }
];
*/

var treeModule = function(opts) {

        var fileStats = {}; 
        var treeCache = {}
        
        var statsDict = {};

        
        function buildDictTree(stats) {
            statsDict = stats;
            
            for (var file in stats) {
               if (stats.hasOwnProperty(file)) {
                    buildIndividualTree(file, stats[file].inc);
                }
            }

            return treeCache;
        }

        function buildIndividualTree(file, incArray)
        {
            if (treeCache.hasOwnProperty(file)) {
                //TODO: Bump the refcount
                //console.log(file + ": ", treeCache[file]);
                return treeCache[file];
            }

            var obj = {};

            for (var i=0; i < incArray.length; i++) {
                var key = incArray[i];

                obj[key] = buildIndividualTree(key, statsDict[key].inc);
            }

            treeCache[file] = obj;

            return obj;
        }
        
        function lookupStats(fileName) {
            var stats =  fileStats.find(x=>x.name == fileName);
            if (!stats) 
                console.log(fileName);

            return stats;
        }

        function flattenTree(tree)
        {
            var flatTree = {}
            for (var node in tree) {
                if (tree.hasOwnProperty(node)) {
                    flatTree[node] = getDistinctIncludes(tree[node]);
                 }
             }
             return flatTree;
        }

        function getDistinctIncludes(treeNode)
        {
            var flatObjNode = {}
            var flatArray = [];
            flatten(treeNode, flatObjNode);
            for (var fname in flatObjNode)
            {
                if (flatObjNode.hasOwnProperty(fname))
                {
                    flatArray.push(fname);
                }
            }
            flatArray.sort();
            return flatArray;
        }

        function flatten(obj, node)
        {
            for (var prop in obj)
            {
                if (obj.hasOwnProperty(prop))
                {
                    node[prop] = {};
                    flatten(obj[prop], node);
                }
            }
        }

    
        return {
            //buildTree: buildTree,
            buildDictTree: buildDictTree,
            flattenTree : flattenTree
        }
    }




module.exports = treeModule;


//var actualTree = treeModule().buildTree(sampleStats1);

//buildTree(sampleStats1)
/*
var expectedString = JSON.stringify(expectedTree);
var actualString = JSON.stringify(actualTree);
console.log(expectedString)
console.log(actualString)
console.log(expectedString == actualString);
*/
