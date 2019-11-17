import sys
import os
import datetime
import requests
import json
import pymysql
import time
import socket
import threading


sys.path.append("./libs")
sys.path.append("./../")
from sqlBd import Bd
import server_coordinador

ALLOWED_EXTENSIONS = {'txt'}

respuestas = []

def avisa_soy_nuevo_coordinador( equipo ):
	r = requests.post( equipo['direccion'] )
	pass


def iniciaEleccionNuevoCoordinador( tipoServer , prioridadEquipos, myIP, myPriority):
	global respuestas
	respuestas = [None]*len(prioridadEquipos)
	for equipo in prioridadEquipos:
		if equipo['direccion'] == myIP:
			continue
		if equipo['prioridadEquipos']>myPriority:
			h = threading.Thread(target=avisa_soy_nuevo_coordinador, name="Avisa nuevo coord", args=(equipo,) ) 
			h.start()
			h.join()
		
	if 'No' in respuestas:
		return False
	else:
		for equipo in prioridadEquipos:
			if equipo['direccion'] == myIP:
				continue
		if equipo['prioridadEquipos']>myPriority:
			h = threading.Thread(target=confirma_soy_nuevo_coordinador, name="Avisa nuevo coord", args=(equipo,) ) 
			h.start()

def allowed_file(filename):
	return '.' in filename and \
		   filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def leeArchivoTxt(pathFilename):
	archivo = open(pathFilename, "r")
	numsStr = archivo.readlines()
	numsList = []
	for num in numsStr:
		numsList.append( int(num.strip()) )
	return numsList

#Esta función guardará los datos recibidos en la Base de datos
def guardaEnBd(ip_origen, numeroServer, suma, relojObject, nombreEquipo, dbName=None):
	resultado = {'ok':True, 'description':suma}

	now = datetime.datetime.now()
	datetimeServer = str(now.year)+"-"+str(now.month)+"-"+str(now.day)+" "

	datetimeServer += str(relojObject.hora)+":"+str(relojObject.mins)+":"+str(relojObject.segs)

	bd = connectToBd(dbName=dbName['name'])

	a = bd.doQuery("""
	INSERT INTO resultados_envios(date_added, ip_origen, nombre_equipo, num_jugador, resultado_suma) 
	VALUES('{}', '{}', '{}', '{}', '{}');""".format(
			str(datetimeServer), str(ip_origen), str(nombreEquipo), str(numeroServer), str(suma)
		)
	)
	resultado['description'] = "Resultado almacenado"

	return resultado

def sendResultToOtherServer(ip_origen, numeroServer, suma, nombreEquipoOrigen):
	from server_coordinador import env
	print("Llegó a función de hilo")
	destino = env['send_to']
	data_to_send = {
		'ip_origin' : ip_origen,
		'num_jugador_origin' : numeroServer,
		'resultado_suma' : suma,
		'nombre_equipo_origin' : nombreEquipoOrigen
	}
	r = requests.post("http://"+destino+"/numeros/save-result-peer", json=data_to_send)
	print("Hizo petición de hilo y regresará")
	return r.text

def connectToBd(dbName=None):

	bd_name=dbName
	if dbName is None:
		bd_name = "resguardo_sumas_1"

	return Bd(	
		hostname = "10.100.70.115",
		username = "root",
		password = "12345",
		database = bd_name
	)