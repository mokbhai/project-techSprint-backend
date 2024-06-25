
# Take file name as argument
FILE_NAME=$1

# create files
touch "src/models/${FILE_NAME}Model.js"
touch "src/controllers/${FILE_NAME}Controller.js"
touch "src/services/${FILE_NAME}Service.js"
touch "src/tests/${FILE_NAME}test.js"
