from django.shortcuts import render
from rest_framework.response import Response

# Create your views here.
def index(request, *args, **kwargs):
  return Response({"message":"Hello Guys from Django"})