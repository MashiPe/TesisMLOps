from tableschema import Table, Schema


class Tipo():
    def __init__(self, csv):
        self.schema = None
        self.csv = csv
        self.table = Table(csv)

    def getSchema(self):
        self.table.infer()
        return self.table.schema.descriptor

    def setType(self, name, type):
        self.table.schema.update_field(name=name,update= {'type': type})
        self.table.schema.commit()
        if self.table.schema.valid:
            return self.table
        else:
            print("error")
            return 1


if __name__ == '__main__':
    tipo = Tipo('/home/daniel/test.csv')
    print(tipo.getSchema())
    table = tipo.setType('columna2', 'number')
    print(table.schema.descriptor)
    for keyed_row in table.iter(keyed=True):
        print(keyed_row)
