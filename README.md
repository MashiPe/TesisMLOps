# MLOps platform prototype

Repository of the project made as tesis to obtain my System's Engieneer degree at [Universidad de Cuenca](https://www.ucuenca.edu.ec/). Developed in collaboration with [seaman69](https://github.com/seaman69) and directed by [Victor Saquicela](https://orcid.org/0000-0002-2438-9220). This is just a prototype of a platform to perform machine learning experiments. The platform automates the experimentation process using the MLOps paradigm as foundation following the process shown in the next image:

![Phases](./assets/phases.jpg)

The whole process begins with the Experiment Definition phase, in which the sequence of steps to be followed in the experiment is determined, and the dependencies and resources required for it are defined. The second phase, Resource Provisioning, involves deploying all the necessary services to carry out the experiment described in the previous phase. The phases of Data Extraction, Data Exploration, Data Processing, Model Building, and Model Validation are responsible for all data processing, from data extraction to model generation and validation. Finally, the Deployment phase will only be done locally, exposing the generated models through a REST API.

## Architecture

![Architecture figure](./assets/arch.jpg)

## Dependencies

Make sure to install all the dependencies for the project:

- Docker
- Docker-Compose
- Flask
- Python
- GraphDB

## Installation

The project depends on Docker, Docker-Compose and Flask. An installation script is provided for ubuntu-based distributions. To install all dependencies use:

```
sh installation.sh
```

This script install Docker, Docker-Compose and Python dependencies using pip. GraphDB can be downloaded from [here](https://www.ontotext.com/products/graphdb/download/). Make sure to let GraphDB run on port `7200`.

## Execution

Once everything is installed the `execute.sh` script can be used to start the program.

```
sh execute.sh
```

The web UI can be accessed on `localhost:3000`. Use the `manual.pdf` document as reference.
