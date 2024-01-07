dbs=(test_database audit elearning backup)

for db in "${dbs[@]}"; do 
    psql -U postgres -c "CREATE DATABASE ${db};"
    for file in sql/${db}/*.sql
    do
        if [ -f "$file" ]
        then
            psql -d ${db} -f "$file"
        fi
    done
done