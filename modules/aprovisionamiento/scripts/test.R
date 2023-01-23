#!/usr/bin/env Rscript
library(rjson)
library(RPostgreSQL)
library(ini)
library(tables)
args <- commandArgs(trailingOnly = TRUE)
 #message(sprintf("Hello %s", args[1L]))
msg <- args[1L]
opt <- booktabs()
sprintf("%s",msg)
msg_json <- toString(msg)
msg_json <- gsub('[*]', '"', msg_json)
print(msg_json)
json <- rjson::fromJSON(msg_json, simplify = TRUE)
print(json)
filename <- "/home/daniel/PycharmProjects/TesisMLOps/modules/aprovisionamiento/scripts/iris_svm_v1.ini"
data <- read.ini(filename)
pg <- dbDriver("PostgreSQL")
# Local Postgres.app database; no password by default
# Of course, you fill in your own database information here.
con <- dbConnect(pg, user=data$postgresql$user, password=data$postgresql$password,
                 host=data$postgresql$host, port=data$postgresql$port, dbname=data$postgresql$dbname)



dtab <- dbGetQuery(con, "select * from encuestas_database")
dtab2 <- as.data.frame(dtab)
print(names(dtab2))
tt <- tables::tabular(tabular((( Gener <- Genero ) + ( Total <- 1 ) ~ ( `Lugar Trabajo` <- LugarTrabajo ) + ( Total <- 1 )), data=dtab2))

 