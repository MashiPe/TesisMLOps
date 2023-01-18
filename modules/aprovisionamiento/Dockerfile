FROM ubuntu:latest
ENV TZ=America/Guayaquil
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt-get update
RUN apt-get install wget -y
RUN apt-get install python3-pip -y
RUN apt-get install libpq5
RUN wget -qO- https://cloud.r-project.org/bin/linux/ubuntu/marutter_pubkey.asc | gpg --dearmor -o /usr/share/keyrings/r-project.gpg
RUN echo "deb [signed-by=/usr/share/keyrings/r-project.gpg] https://cloud.r-project.org/bin/linux/ubuntu jammy-cran40/" | tee -a /etc/apt/sources.list.d/r-project.list
RUN apt-get update
RUN apt-get install -y r-base
RUN pip3 install flask
RUN pip3 install -U scikit-learn
RUN pip3 install -U matplotlib
RUN pip3 install -U pandas
RUN pip3 install -U seaborn
RUN pip3 install -U psycopg2-binary
RUN pip3 install -U joblib
RUN pip3 install -U sqlalchemy
RUN pip3 install -U psycopg
RUN pip3 install -U fpdf
RUN pip3 install -U plot-likert
RUN pip3 install -U factor_analyzer
ADD ejecutorScripts.py /root
COPY scripts /root/scripts
WORKDIR /root

EXPOSE 4001

CMD ["python3","ejecutorScripts.py"]