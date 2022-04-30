from distutils.log import info
from lib2to3.pgen2.token import NEWLINE
from typing import final
from bs4 import BeautifulSoup
from numpy import append
import requests
import pandas as pd
final_data = []

html_text = requests.get('https://food.ndtv.com/recipes/breads-recipes').text

soup = BeautifulSoup(html_text,'lxml')

recipes = soup.find_all('div', class_="vjl-md-4 glr_mb-30")

for recipe in recipes:

    i=recipe.find('span',class_='crd_lnk')
    recipe_name = i.text

    t= recipe.find('span',class_='SrcCrd-ph_im-ft-nu')
    cook_time =t.text

    img= recipe.find('img',class_='lz_img lazy')
    recipe_image=img['content']

    j=recipe.find('a',class_='crd_img')
    url= j['href']

    html_subtext = requests.get(url).text
    soup2 =BeautifulSoup(html_subtext,'lxml')
    ingredients = soup2.find('p',class_='aut_crd-txt').text
    
    data ={'recipe name':recipe_name , 'cooking time':cook_time ,'link':url, 'recipe image':recipe_image , 'ingredient':ingredients}
    final_data.append(data)

df = pd.DataFrame(final_data)
df .to_csv('breadrecipe.csv') 

