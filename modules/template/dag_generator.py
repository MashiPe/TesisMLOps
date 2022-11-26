from jinja2 import Environment,FileSystemLoader, select_autoescape
import re
import json

env = Environment(
    loader=FileSystemLoader('./templates'),
    autoescape=select_autoescape(),
    trim_blocks=True
)

op_template = env.get_template('operators/data_ingest/read_table.py.jinja')
dag_template = env.get_template("dag_template.py.jinja")

op_data ={
    "input":["iris"],
    "output": ["IrisDataset"],
}

dag_ops = {
    'op_1': op_template.render(op_data,datasets_data_base = 'test')
}

op_template = env.get_template('operators/data_transformation/reformat_data.py.jinja')
op_data = {
    "input": [ "IrisDataset" ],
    "output": ["EncodedIrisDataset"],
    "encode_target":"class",
    "map":{
        "Iris-virginica":3,
        "Iris-versicolor":2,
        "Iris-setosa":1}
}

dag_ops['op_2'] = op_template.render(op_data)

task_definition = {'TableReader':'read_table_iris','Map':'map_class'}
order_list = [ "read_table_iris_op>>map_class_op" ]

dag_pipeline = dag_template.render({'dags_ops':dag_ops,'order_list':order_list,
                                    'fun_op_def':task_definition,'experiment_name':'iris_svm'})

# test = template.render(data)

# print(dag_ops['op_1'])
# print(re.findall(r"def .*\(\)*:*",str(dag_ops['op_1']))[0][4:-1])
# print(re.findall(r"read_table_iris",str(dag_ops['op_1'])))
print(dag_pipeline)

with open("iris_svm.py","w") as pipeline_file:
    pipeline_file.write(dag_pipeline)



template_paths={
    "DataTableReader": "operators/data_ingest/read_table.py.jinja",
    "ReformatData":"operators/data_transformation/reformat_data.py.jinja"
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

        task_defs = {}
        dag_ops = {}
        ops_order_list = []
        
        ### Generating task for each operator

        for op_name in pipeline_data['operators']:
            
            op = pipeline_data['operators'][op_name]

            template_path = self.template_paths[op['op_type']]

            jin_template = self.jinja_env.get_template(template_path)

            dag_task = jin_template.render(op['parameters'],input=op['input'],output=op['output'])
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
            "experiment_name" : experiment_name,
            "dags_ops": dag_ops,
            "order_list":ops_order_list,
            "fun_op_def":task_defs
        }

        pipeline = pipe_template.render(pipe_data)
        
        return pipeline


generator = Pipe_Generator()

f = open('iris_svm_partial.json')

data = json.load(f)

f.close()

pipeline = generator.genPipe(data)

print(pipeline)

with open("iris_svm_partial.py","w") as pipeline_file:
    pipeline_file.write(pipeline)