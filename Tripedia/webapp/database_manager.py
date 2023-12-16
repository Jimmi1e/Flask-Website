from flask import request
from flask_pymongo import PyMongo
from pymongo import MongoClient, DESCENDING

from app_instance import app
mongo = PyMongo(app)
#mongodb base class
class MongoDBManager():
    def __init__(self, app_instance):
        self.mongo = PyMongo(app_instance)
        #attention: add the collection name when a table is added.
        self.collection_names = ['userInfo']

    #get the collection by collection_name
    def get_collection(self, collection_name):
        return self.mongo.db[collection_name]

    #get target entry list of all items
    def list_all_items_target_entry(self, collection_name, target_entry):
        data = self.mongo.db[collection_name].find()
        res_list = []
        for item in data:
            res_list.append(item[target_entry])
        return res_list

    #insert item to collection with collection_name
    def insert_item_to_collection(self, collection_name, item):
        return self.get_collection(collection_name).insert_one(item)

    #find the item from collection with request
    def find_item_from_collection_with_request(self, collection_name, item_key):
        return self.get_collection(collection_name).find_one({item_key: request.form[item_key]})

    #find the item from collection without request
    def find_item_from_collection(self, collection_name, item_key, item_value):
        return self.get_collection(collection_name).find_one({item_key: item_value})

    def update_item_in_collection(self, collection_name, query, update_data):
        self.get_collection(collection_name).update_one(query, update_data)

    def update_user_info(self, username, updated_data):
        return self.get_collection('userInfo').update_one({'username': username}, {'$set': updated_data})
    #todo: insert data/ delete data/ modify data/ ... add the basic database interface

#global database manager
mongo_manager = MongoDBManager(app)

#The different table has its own logic
class UserInfoCollection():
    def __init__(self, ):
        self.collection_name = 'userInfo'

    def insert_one_user(self, item):
        return mongo_manager.insert_item_to_collection(self.collection_name, item)

    def find_user_info(self, user_name):
        return mongo_manager.find_item_from_collection_with_request(self.collection_name, user_name)
    def list_users_name(self):
        users_name_list = mongo_manager.list_all_items_target_entry(self.collection_name, 'username')
        return users_name_list

    def find_user_by_username(self, username):
        return mongo_manager.find_item_from_collection(self.collection_name, 'username', username)

    def update_user_info(self, username, new_name, new_phone, new_email, new_sex, new_age, new_secret):
        mongo_manager.get_collection(self.collection_name).update_one(
            {"username": username},
            {
                "$set": {
                    "name": new_name,
                    "phone": new_phone,
                    "email": new_email,
                    "sex": new_sex,
                    "age": new_age,
                    "secret": new_secret
                }
            }
        )
    def get_user_info(self, username):
        user_data = mongo_manager.get_collection(self.collection_name).find_one({"username": username})
        return user_data if user_data else None
    def update_password(self, username, new_password):
        mongo_manager.update_item_in_collection(self.collection_name, {'username': username}, {'$set': {'password': new_password}})

#a global userinfor manager
user_infor_manager = UserInfoCollection()

class Moments():
    def __init__(self, uri):
        self.mongo_client = MongoClient(uri)
        self.db = self.mongo_client.Tripedia
        self.moments_collection = self.db.moments

    def get_moments(self):
        return self.moments_collection.find().sort("create_at", DESCENDING)

    def insert_moment(self, moment_data):
        self.moments_collection.insert_one(moment_data)
