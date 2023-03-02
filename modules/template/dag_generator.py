from jinja2 import Environment,FileSystemLoader, select_autoescape
import re
import json
import psycopg2


# env = Environment(
#     loader=FileSystemLoader('./templates'),
#     autoescape=select_autoescape(),
#     trim_blocks=True
# )

# op_template = env.get_template('operators/data_ingest/read_table.py.jinja')
# dag_template = env.get_template("dag_template.py.jinja")

# op_data ={
#     "input":["iris"],
#     "output": ["IrisDataset"],
# }

# dag_ops = {
#     'op_1': op_template.render(op_data,datasets_data_base = 'test')
# }

# op_template = env.get_template('operators/data_transformation/reformat_data.py.jinja')
# op_data = {
#     "input": [ "IrisDataset" ],
#     "output": ["EncodedIrisDataset"],
#     "encode_target":"class",
#     "map":{
#         "Iris-virginica":3,
#         "Iris-versicolor":2,
#         "Iris-setosa":1}
# }

# dag_ops['op_2'] = op_template.render(op_data)

# task_definition = {'TableReader':'read_table_iris','Map':'map_class'}
# order_list = [ "read_table_iris_op>>map_class_op" ]

# dag_pipeline = dag_template.render({'dags_ops':dag_ops,'order_list':order_list,
#                                     'fun_op_def':task_definition,'experiment_name':'iris_svm'})

# test = template.render(data)

# print(dag_ops['op_1'])
# print(re.findall(r"def .*\(\)*:*",str(dag_ops['op_1']))[0][4:-1])
# print(re.findall(r"read_table_iris",str(dag_ops['op_1'])))
# print(dag_pipeline)

# with open("iris_svm.py","w") as pipeline_file:
#     pipeline_file.write(dag_pipeline)



template_paths={
    "DefaultReader": "operators/data_ingest/read_table.py.jinja",
    "ReformatData":"operators/data_transformation/reformat_data.py.jinja",
    "ConfusionMatrix": "operators/conf_matrix.py.jinja",
    "CorrelationMatrix":"operators/correlation_graph.py.jinja",
    "RM_Support_Vector_Machine":"operators/svm.py.jinja",
    "BasicStatistics":"operators/data_transformation/sumary_int.py.jinja",
    "Pivot":"operators/data_transformation/pivot.py.jinja",
    "DropColumns":"operators/data_transformation/drop_column.py.jinja",
    "Plot_likert":"operators/data_transformation/plot_likert.py.jinja",
    "Density":"operators/data_transformation/density.py.jinja",
    "TestBarlett":"operators/data_transformation/kmo_test.py.jinja",
    "Summary":"operators/data_transformation/sumary_int.py.jinja",
    "S_Score":"operators/data_transformation/density.py.jinja",
    "PlotAll":"operators/data_transformation/density.py.jinja",
    "PCA":"operators/data_transformation/density.py.jinja",
    "Kmeans":"operators/data_transformation/density.py.jinja",
    "Groupby":"operators/data_transformation/density.py.jinja",
    "Elbow":"operators/data_transformation/density.py.jinja",
    "SplitData":"operators/data_transformation/split_data.py.jinja"
}

class Pipe_Generator():

    def __init__(self,env:str = "./templates" , aux_temp_path: dict = None ) :
        
        self.template_paths = template_paths
        
        if (aux_temp_path != None):
            self.template_paths = aux_temp_path

        self.jinja_env = Environment(
                loader=FileSystemLoader(env),
                autoescape=select_autoescape(),
                trim_blocks=True
            )

    
    def genPipe(self,pipeline_data: dict ):

        experiment_name = pipeline_data['experiment_name']
        version_name = pipeline_data['version_name']

        self.__gendb__(experiment_name,version_name)

        self.__geninifile__(experiment_name,version_name)

        task_defs = {}
        dag_ops = {}
        ops_order_list = []
        
        ### Generating task for each operator

        for op_name in pipeline_data['operators']:
            
            op = pipeline_data['operators'][op_name]

            template_path = self.template_paths[op['op_type']]

            jin_template = self.jinja_env.get_template(template_path)

            dag_task = jin_template.render(op['parameters'],
                                            op_name=op_name,
                                            version=version_name.lower(),
                                            input=op['input'],
                                            output=op['output'],
                                            inifile="{}.ini".format(experiment_name.lower()+version_name.lower()))
            definition = re.findall(r"def .*_fun\(\):*",dag_task)[0][4:-7]

            dag_ops[op_name] = dag_task
            task_defs[op_name] = definition

        ### Defining starting operators

        # for op_name in pipeline_data['starting_points']:

        #     ops_order_list.append(task_defs[op_name])

        ### Defining operator order

        for op_pair in pipeline_data["order_list"]:

            order_el = "{}".format(task_defs[op_pair[0]])
            if len(op_pair) == 2:
                order_el = "{}_op>>{}_op".format(task_defs[op_pair[0]],task_defs[op_pair[1]])
            
            ops_order_list.append(order_el)

        pipe_template = self.jinja_env.get_template("dag_template.py.jinja")

        pipe_data= {
            "experiment_name" : experiment_name.lower()+version_name.lower() ,
            "dags_ops": dag_ops,
            "order_list":ops_order_list,
            "fun_op_def":task_defs
        }

        pipeline = pipe_template.render(pipe_data)
        
        return pipeline

    def __gendb__(self,exp_name:str,version_name:str):
        conn = psycopg2.connect(
                database="airflow",
                user='airflow',
                password='airflow',
                host='localhost',    #This is localhost cuz is not a docker container
                port= '5432'
            )
        conn.autocommit = True
  
        # Creating a cursor object
        cursor = conn.cursor()
        
        #query to delete database if exists
        sql = 'DROP DATABASE IF EXISTS {}'.format(exp_name.lower()+version_name.lower())
        cursor.execute(sql)

        # query to create a database 
        sql = 'CREATE database {} '.format(exp_name.lower()+version_name.lower())
        
        print(sql)

        # executing above query
        cursor.execute(sql)
        print("Database has been created successfully !!")
        
        # Closing the connection
        conn.close()

    def __geninifile__(self,experiment_name:str,version_name:str,host:str = 'airflow-postgres-1',user:str='airflow',password:str = 'airflow',port:str = '5432'):
        
        dbname = experiment_name.lower()+version_name.lower()

        with open("./aprovisionamiento/scripts/{}.ini".format(dbname),"w") as inifile:
            inifile.write("[postgresql]\n")
            inifile.write("host = {}\n".format(host))
            inifile.write("dbname = {}\n".format(dbname.lower()))
            inifile.write("user = {}\n".format(user))
            inifile.write("password = {}\n".format(password))
            inifile.write("port = {}\n".format(port))
        

# generator = Pipe_Generator()

# f = open('sample.json')

# data = json.load(f)

# f.close()

# pipeline = generator.genPipe(data)

# print(pipeline)

# with open("iris_svm_partial.py","w") as pipeline_file:
#     pipeline_file.write(pipeline)