echo "Executing Start Up Script"

# the array of the databases to create
dbs=(test_database audit elearning)

for db in "${dbs[@]}"; do 
    echo "Creating Database ${db}"
    psql -U postgres -c "CREATE DATABASE ${db};"
    for file in sql/${db}/*.sql
    do
        # checks if a file exists, and if it does executes it
        if [ -f "$file" ]
      	then
            echo "Executing $file"
            psql -d ${db} -f "$file"
        fi
    done
done
