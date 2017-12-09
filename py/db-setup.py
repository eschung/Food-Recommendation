'''
Created on Dec 7, 2017

@author: Edward
'''

from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine

Base = declarative_base()

class Restaurant(Base):
    __tablename__ = 'restaurant'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    address_one = Column(String(100), nullable=True)
    address_two = Column(String(100), nullable=True)
    zip_code = Column(String(5), nullable=True)
    phone_number = Column(String(10), nullable=True)
    description = Column(String, nullable=True)
	
    menuitems = relationship('Menu')
    reviews = relationship('Review')
	
    @property
    def serialize(self):
        """Return object data in easily serializeable format"""
        return {
            'id' = self.id,
            'name'= self.name,
            'address_one' = address_one,
			'address_two' = address_two,
			'zip_code' = zip_code,
			'phone_number' = phone_number,
			'description' = description,
        }

class User(Base)
	__tablename__ = 'user'

    id = Column(Integer, primary_key=True
	user_name = Column(String(100), nullable=False)
	first_name = Column(String(100), nullable=False)
	last_name = Column(String(100), nullable=False)
	email = Column(String(100), nullable=False)
	
	reviews = relationship('Review')
	
	@property
    def serialize(self):
        """Return object data in easily serializeable format"""
        return {
			'id' = self.id,
			'user_name' = self.user_name,
			'first_name' = self.first_name,
			'last_name' = self.last_name,
			'email' = self.email,
        }

class Review(Base)
	__tablename__ = 'review'
	
	id = Column(Integer, primary_key=True)
	comment = Column(String, nullable=False)
	stars = Column(Integer, nullable=False, default=0)
	post_date = Column(DateTime, nullable = False)
	restaurant_id = Column(Integer, ForeignKey('restaurant.id'))
	user_id = Column(Integer, ForeignKey('user.id'))
	
	@property
    def serialize(self):
        """Return object data in easily serializeable format"""
        return {
			'id' = self.id,
			'comment' = self.comment,
			'stars' = self.stars,
			'post_date' = self.post_date,
			'restaurant_id' = self.restaurant_id,
			'user_id' = self.user_id,
        }

class Menu(Base)
	__tablename__ = 'menu'
	
	id = Column(Integer, primary_key=True)
	menu_item_name = Column(String(100), nullable = False)
	menu_item_price = Column(Float, nullable = False)
	restaurant_id = Column(Integer, ForeignKey('restaurant.id'))

	@property
    def serialize(self):
        """Return object data in easily serializeable format"""
        return {
			'id' = self.id,
			'menu_item_name' = self.menu_item_name,
			'menu_item_price' = self.menu_item_price,
			'restaurant_id' = self.restaurant_id,
        }