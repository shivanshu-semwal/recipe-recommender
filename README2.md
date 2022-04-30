## Resources

- [tutorial](https://www.tutorialspoint.com/neo4j/index.htm)


## Official Documentation

- `MATCH (n) DETACH DELETE n` - delete all nodes
- https://neo4j.com/developer/guide-import-csv/
- https://neo4j.com/developer/kb/performing-match-intersection/
- https://github.com/neo4j-contrib/neo4j-apoc-procedures/
- https://neo4j.com/docs/cypher-manual/current/functions/list/
- https://neo4j.com/docs/http-api/3.5/
- https://neo4j.com/docs/cypher-manual/current/functions/predicate/
- https://neo4j.com/developer/kb/performing-match-intersection/
- https://code.tutsplus.com/tutorials/a-beginners-guide-to-http-and-rest--net-16340

## recipe database structure

- `Boondi -> Gram flour, ghee, sugar -> vegetarian`
- `Kaju katli -> Cashews, ghee, cardamom, sugar -> vegetarian`


### recipe node

```
create (a:recipe{name: "Boondi", type: "vegetarian", time: "1hr"})
create (b:recipe{name: "Kaju katli", type: "vegetarian"})
```

### ingredients node

```
create (i1:ingredient{name: "Cashews"})
create (i2:ingredient{name: "Gram flour"})
create (i3:ingredient{name: "ghee"})
create (i4:ingredient{name: "sugar"})
create (i5:ingredient{name: "cardamom"})
```

### relationship

```
MATCH (a:recipe), (b:ingredient) 
where a.name="Boondi" AND b.name="Gram flour" 
CREATE (a)-[:need {quantity:1, unit="gm"}]->(b)
return a,b
```

```
MATCH (a:recipe), (i3:ingredient) 
where a.name="Boondi" AND i3.name="ghee" 
CREATE (a)-[:need {quantity:13}]->(i3)
return a,i3

MATCH (a:recipe), (i4:ingredient) 
where a.name="Boondi" AND i4.name="sugar" 
CREATE (a)-[:need {quantity:11}]->(i4)   
return a,i4

MATCH (b:recipe), (i1:ingredient) 
where b.name="Kaju katli" AND i1.name="Cashews" 
CREATE (b)-[:need {quantity:19}]->(i1)   
return b,i1

MATCH (b:recipe), (i3:ingredient) 
where b.name="Kaju katli" AND i3.name="ghee" 
CREATE (b)-[:need {quantity:4}]->(i3)   
return b,i3

MATCH (b:recipe), (i5:ingredient) 
where b.name="Kaju katli" AND i5.name="cardamom" 
CREATE (b)-[:need {quantity:3}]->(i5)   
return b,i5

MATCH (b:recipe), (i4:ingredient) 
where b.name="Kaju katli" AND i4.name="sugar" 
CREATE (b)-[:need {quantity:4}]->(i4)  
return b,i4
```

### Load dataset from csv file

```
LOAD CSV WITH HEADERS FROM 'file:///indian_food.csv' AS row
WITH row WHERE row.ingredients IS NOT NULL
UNWIND split(row.ingredients, ',') AS i
MERGE (c:ingredients {name: i});
```

```
LOAD CSV WITH HEADERS FROM 'file:///hi.csv' AS row
WITH row WHERE row.name IS NOT NULL
MERGE (rec:recipe {name: row.name})
WITH rec, row
UNWIND split(row.ingredients, ',') AS i
MERGE (c:ingredients {name: i})
MERGE (c)-[r:USED_IN]->(rec)
```

```
LOAD CSV WITH HEADERS FROM 'file:///hi.csv' AS row
WITH row WHERE row.name IS NOT NULL
MERGE (rec:recipe {name: row.name})
```

```
LOAD CSV WITH HEADERS FROM 'file:///hi.csv' AS row
WITH row WHERE row.name IS NOT NULL
UNWIND split(row.ingredients, ',') AS i
MERGE (c:ingredients {name: i})
```

# final queries

## check recipes with ingredient

```
match (i:ingredients{name: "milk"})<-[:NEED]-(n) return i, n
```

## check ingredients for recipe

```
match (r:recipe{name: "Paravannam"})-[:NEED]->(n) return n,r
```

## create

```
LOAD CSV WITH HEADERS FROM 'file:///hi.csv' AS row
WITH row WHERE row.name IS NOT NULL
MERGE (rec:recipe {name: row.name})
WITH rec, row
UNWIND split(row.ingredients, ',') AS i
MERGE (c:ingredients {name: lTrim(rTrim(i))})
MERGE (rec)-[r:NEED]->(c)
```

## queries

```
with ['milk', 'sugar'] as  names
match (i:ingredients)<-[:NEED]-(n:recipe)
where i.name in names
return n, i
```

```
match (p1:ingredients)<-[:NEED]-(r:recipe)-[:NEED]->(p2:ingredients)
where p1.name="milk" and p2.name="sugar"
with p1,p2, collect(r) as commonrecipe
return p1,p2, commonrecipe
```

```
WITH ['milk', 'sugar'] as names
MATCH (p:ingredients)
WHERE p.name in names
WITH collect(p) as ingredient
MATCH (m:recipe)
WHERE ALL(p in ingredient WHERE (p)<-[:NEED]-(m))
RETURN m
```