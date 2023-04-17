import random
from datetime import date, datetime, timedelta
import json
from pathlib import Path
import argparse

from faker import Faker


def createSql(schema, tableName, total):
    """Create SQL statements to populate a table with dummy data.

    Args:
        schema (list[dict]): A list of dictionaries, where each dictionary represents a column in the table. Each dictionary must contain the following keys:
            - "name" (str): The name of the column.
            - "dataType" (str): The data type of the column.
        tableName (str): The name of the table to insert the data into.
        total (int): The total number of rows to generate.

    Returns:
        str: The SQL statement that can be used to populate the table with dummy data.

    Examples:
        >>> schema = [
                {"name": "id", "dataType": "integer"},
                {"name": "name", "dataType": "string"},
                {"name": "age", "dataType": "integer"}
            ]
        >>> createSql(schema, "people", 10)
        'INSERT INTO people (id, name, age)\n\tVALUES\n\t\t(1,'Sydney Lee',38),\n\t\t(2,'Micheal James',54),\n\t\t(3,'Sophia Brown',20),\n\t\t(4,'Lauren Davis',26),\n\t\t(5,'Edward Collins',49),\n\t\t(6,'Linda Clark',47),\n\t\t(7,'Vicky Green',43),\n\t\t(8,'Marshall Robinson',32),\n\t\t(9,'Andrew Jackson',37),\n\t\t(10,'Dorothy Martinez',60);'
    """
    fake = Faker("en_GB")

    sql = "INSERT INTO " + tableName + " ("

    for i in range(len(schema)):
        sql += schema[i]['name']
        sql += ", " if len(schema)-1 != i else ")\n\tVALUES\n\t\t"

    for i in range(total):
        singleVal = "("
        for j in range(len(schema)):
            insertVal =  genVal(schema[j], fake=fake) if "forceVal" not in schema[j] else schema[j]["forceVal"]
        
            insertVal = insertVal.replace("'", "''") if type(insertVal) == str else insertVal
            
            singleVal += "'" + insertVal + "'" if type(insertVal) == str else str(insertVal)
            singleVal += "," if len(schema)-1 != j else ")"
        sql += singleVal 
        sql += ",\n\t\t" if total-1 != i else ""

    return sql + ";"

def genVal(row, fake=Faker("en_GB")):
    """Generate a random value based on the given configuration.

    Args:
        row (dict): A dictionary containing the configuration details of the value to be generated.
            It should contain the following keys:
            - "name": Name of the field.
            - "dataType": Type of data to generate.
            - "unique" (optional): A boolean flag indicating whether the generated value should be unique.
            - "valRange" (optional): A list containing the minimum and maximum values for the generated value.
            - "decimalPlace" (optional): An integer specifying the number of decimal places to round the generated value to.
            - "possibleVals" (optional): A list of possible values to choose from.

        fake (Faker, optional): An instance of the Faker class to use for generating the values. Defaults to Faker("en_GB").

    Returns:
        A randomly generated value of the specified type.

    Examples:
        >>> genVal({"name": "forename", "dataType": "string"})
        'Julia'
        >>> genVal({"name": "age", "dataType": "integer", "valRange": [18, 65]})
        34
    """
    if "unique" in row:
        if row['unique']:
            if row["name"] == "forename":
                return fake.unique.first_name()
            elif row["name"] == "surname":
                return fake.unique.first_name()
            elif row["name"] == "email":
                return fake.unique.email()
            elif row["dataType"] == "string":
                return fake.unique.word()
    
    if row["name"] == "forename":
        return fake.first_name()
    elif row["name"] == "surname":
        return fake.last_name()
    elif row["name"] == "profession":
        return fake.job()
    elif row["name"] == "email":
        return fake.email()
    elif row["name"] == "country":
        return fake.country()

    if ("valRange" not in row) and (row["dataType"] == "integer" or row["dataType"] == "decimal"):
        min = random.randrange(1,10)
        row["valRange"] = [min, random.randrange(min,min*100)]

    if ("valRange" not in row) and (row["dataType"] == "datetime"):
        return str(fake.date_time())

    if "possibleVals" in row:
        return random.choice(row["possibleVals"])
    elif row["dataType"] == "boolean":
        return random.choice([True, False])
    elif row["dataType"] == "string":
        return fake.word()
    
    if "valRange" in row:
        if row["dataType"] == "datetime":
            startDate = datetime.fromisoformat(row["valRange"][0])
            endDate = datetime.fromisoformat(row["valRange"][1])
            return str(fake.date_time_between(startDate, endDate))
        elif row["dataType"] == "integer":
            return random.randrange(row["valRange"][0], row["valRange"][1])
        elif "decimalPlace" in row:
            return round(random.uniform(row["valRange"][0], row["valRange"][1]), row["decimalPlace"])
        else: 
            return random.uniform(row["valRange"][0], row["valRange"][1])
    

def generateSqlFiles(directory, numOfRows, outFile="fill-tables.sql"):
    """Generate SQL files to fill tables with dummy data.

    Args:
        directory (str): The directory path containing the JSON files defining the table configurations.
        numOfRows (int): The number of rows that should be generated
        outFile (str, optional): The name of the output file to write the SQL statements to. Defaults to "fill-tables.sql".
    """
    files = Path(directory).glob("*.json")
    
    createSqlFile = open(outFile, "w")
    createSqlFile.close()

    for file in files:
        tableFile = open(file)
        tableInfo = json.load(tableFile)

        dummyData = open(outFile, "a")
        dummyData.write(createSql(tableInfo["rows"], tableInfo["tableName"], numOfRows) + "\n\n")

        tableFile.close()
        dummyData.close()


if __name__ == '__main__':
    descStr = "Generates dummy data for the audit or elearning databases, this does not guarantee the consistency of the data"
    parser = argparse.ArgumentParser(description=descStr)
    parser.add_argument("--n", dest="numOfRows", required=True, help="The number of columns you would like to generate for each table")
    parser.add_argument("--a", dest="audit", required=False, default=False, action="store_true", help="Specifies the audit database")
    parser.add_argument("--e", dest="elearn", required=False, default=False, action="store_true", help="Specifies the e-learning database")

    args = parser.parse_args()

    directory = ""
    if args.audit:
        directory = "./schemas/audit"
    elif args.elearn:
        directory = "./schemas/elearning"

    if directory != "":
        generateSqlFiles(directory, int(args.numOfRows))
    else:
        print("Specify which database you would like to generate the data for, next time")