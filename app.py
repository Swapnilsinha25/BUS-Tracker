from flask import Flask, render_template, request, jsonify
import time

app = Flask(__name__)

location = {
    "lat": 28.6139,
    "lng": 77.2090,
    "timestamp": time.time()
}

@app.route("/")
def tracker():
    return render_template("tracker.html")

@app.route("/viewer")
def viewer():
    return render_template("viewer.html")

@app.route("/update_location", methods=["POST"])
def update_location():
    global location

    data = request.json

    location["lat"] = data["lat"]
    location["lng"] = data["lng"]
    location["timestamp"] = time.time()

    return jsonify({"status": "success"})

@app.route("/get_location")
def get_location():
    return jsonify(location)

if __name__ == "__main__":
    app.run(debug=True)
