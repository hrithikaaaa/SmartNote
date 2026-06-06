from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
db = client["notes_db"]
collection = db["notes"]

# CREATE note
@app.route("/notes", methods=["POST"])
def add_note():
    data = request.json
    collection.insert_one({"text": data["text"]})
    return jsonify({"message": "Note added"}), 201

# GET all notes
@app.route("/notes", methods=["GET"])
def get_notes():
    notes = []
    for note in collection.find():
        notes.append({"id": str(note["_id"]), "text": note["text"]})
    return jsonify(notes)

# DELETE note
@app.route("/notes/<id>", methods=["DELETE"])
def delete_note(id):
    collection.delete_one({"_id": id})
    return jsonify({"message": "Deleted"})

if __name__ == "__main__":
    app.run(debug=True)