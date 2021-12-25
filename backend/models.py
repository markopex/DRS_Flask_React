from exts import db


"""
    Class Recipe: 
    id: int primary key
    title:str
    description: str (text)
"""

class Recipe(db.Model):
    id=db.Column(db.Integer(), primary_key=True)
    title=db.Column(db.String(), nullable=False)
    description=db.Column(db.Text(), nullable=False)

    def __reprt__(self):
        return f'<Recipe {self.title}>'


    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
        
    def update(self, title, description):
        self.title = title
        self.description = description
        
        db.session.commit()
        
#user model 

"""
Class User:
    id:integer
    username:string
    email:string
    password:string
"""

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(25), nullable=False, unique=True)
    email = db.Column(db.String(25), nullable=False, unique=True)
    password = db.Column(db.Text(), nullable=False)
    lastname = db.Column(db.String(50), nullable=False)
    firstname = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(50), nullable=False)
    city = db.Column(db.String(50), nullable=False)
    country = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    isActive = db.Column(db.Boolean, nullable=False)

    def _repr_(self):
        return f'<User {self.username}>'

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(self, password, lastname, firstname, address, city, country, phone):
        self.password = password
        self.lastname = lastname
        self.firstname = firstname
        self.address = address
        self.city = city
        self.country = country
        self.phone = phone
        db.session.commit()
    
    def activate(self):
        self.isActive = true
        db.session.commit()

class Account(db.Model):
    id = db.Column(db.String, primary_key=True)
    balance = db.Column(db.DECIMAL(12,2), nullable=False)
    currency = db.Column(db.String(3), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(User.id))

    def save(self):
        db.session.add(self)
        db.session.commit()

# class OnlineTransaction(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     amount = db.Column(db.Numeric, nullable=False)
#     from_user = db.Column(db.id, db.ForeignKey(User.id))
#     to_user = db.Column(db.id, db.ForeignKey(User.id))

# class BankTransaction(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     amount = db.Column(db.Numeric, nullable=False)
#     from_user = db.Column(db.id, db.ForeignKey(User.id))
#     to_user = db.Column(db.String, nullable=False)