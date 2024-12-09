import json
from flask import Flask, request, jsonify
from flask_cors import CORS

def matching_symptoms(input_string):
    symptoms_list = [   
    "Sốt", "Ho", "Đau đầu", "Đau họng", "Khó thở", "Đau ngực", "Ho có đờm",
    "Chảy máu mũi", "Ngạt mũi", "Ngứa da", "Phát ban", "Đau bụng", "Tiêu chảy",
    "Mệt mỏi", "Mất nước", "Sưng đau khớp", "Cứng khớp", "Đau dạ dày", "Ợ nóng",
    "Sốt cao", "Xuất huyết dưới da", "Phát ban đỏ", "Ngứa mắt", "Chảy nước mắt",
    "Chóng mặt", "Đau bụng dưới", "Tiểu buốt", "Đau lưng", "Tê chân", "Co giật",
    "Rụng tóc", "Ngứa da đầu", "Đau tai", "Chảy dịch tai", "Ho khan", "Đau răng",
    "Sưng nướu", "Đau cổ", "Khó cử động", "Chướng bụng", "Sưng chân", "Đau nhức",
    "Mất ý thức tạm thời", "Ra máu bất thường", "Sốt nhẹ", "Ho có đờm xanh", "Khát nước",
    "Tiểu nhiều", "Mất ngủ", "Lo lắng", "Đau đầu dữ dội", "Nôn mửa", "Mờ mắt"
    ]
    matching_symptoms = [symptom for symptom in symptoms_list if symptom.lower() in input_string.lower()]
    return matching_symptoms

def load_data(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data

# Load data at startup
disease_data = load_data("data.json")

def preprocess_data(data):
    disease_counts = {}
    symptom_counts = {}
    disease_symptom_counts = {}
    medicine_map = {}

    for entry in data:
        symptoms = entry["symptoms"]
        disease = entry["disease"]
        medicine = entry["medicine"]

        disease_counts[disease] = disease_counts.get(disease, 0) + 1

        for symptom in symptoms:
            if disease not in disease_symptom_counts:
                disease_symptom_counts[disease] = {}
            disease_symptom_counts[disease][symptom] = disease_symptom_counts[disease].get(symptom, 0) + 1
            symptom_counts[symptom] = symptom_counts.get(symptom, 0) + 1

        medicine_map[disease] = medicine

    return disease_counts, disease_symptom_counts, medicine_map

def calculate_probabilities(input_symptoms, disease_counts, disease_symptom_counts):
    total_cases = sum(disease_counts.values())
    probabilities = {}

    for disease, count in disease_counts.items():
        disease_prob = count / total_cases
        symptom_prob = 1
        for symptom in input_symptoms:
            if symptom in disease_symptom_counts[disease]:
                symptom_prob *= disease_symptom_counts[disease][symptom] / count
            else:
                symptom_prob *= 1e-6

        probabilities[disease] = disease_prob * symptom_prob

    return probabilities

def recommend_medicine(input_symptoms, data):
    disease_counts, disease_symptom_counts, medicine_map = preprocess_data(data)
    symptoms = matching_symptoms(input_symptoms)
    if not symptoms:  # Kiểm tra nếu không có triệu chứng nào phù hợp
        print("Không tìm thấy triệu chứng nào phù hợp.")
        return "","", ""
    probabilities = calculate_probabilities(symptoms, disease_counts, disease_symptom_counts)
    # Chọn bệnh có xác suất cao nhất
    if not probabilities or all(prob == 0 for prob in probabilities.values()):
        return "","", ""
    predicted_disease = max(probabilities, key=probabilities.get)
    recommended_medicine = medicine_map[predicted_disease]

    return predicted_disease, recommended_medicine, probabilities

app = Flask(__name__)
CORS(app)

@app.route('/diagnose', methods=['POST'])
def diagnose():
    request_data = request.json
    input_symptoms = request_data.get('input', '')
    
    predicted_disease, recommended_medicine, probabilities = recommend_medicine(input_symptoms, disease_data)

    return jsonify({
        "input_symptoms": input_symptoms,
        "predicted_disease": predicted_disease,
        "recommended_medicine": recommended_medicine,
        "probabilities": probabilities
    })

if __name__ == '__main__':
    app.run(port=5000)
    
# Chạy thử
# input_symptoms = "Tôi bị sưng chân"
# input_symptoms = input_symptoms.lower()
# predicted_disease, recommended_medicine, probabilities = recommend_medicine(input_symptoms, data)

# print(f"Triệu chứng nhập vào: {input_symptoms}")
# print(f"Bệnh được dự đoán: {predicted_disease}")
# print(f"Thuốc được gợi ý: {recommended_medicine}")
# print(f"Xác suất từng bệnh: {probabilities}")