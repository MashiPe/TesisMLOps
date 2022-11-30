FROM ubuntu

RUN apt-get update
RUN apt-get install python3-pip -y
RUN pip3 install flask
RUN pip3 install -U scikit-learn
ADD controladorAPIREST.py /root
WORKDIR /root

EXPOSE 4000

CMD ["python3","cositodeflask.py"]