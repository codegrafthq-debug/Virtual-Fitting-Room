import streamlit as st
import google.generativeai as genai
from PIL import Image
import os

# 1. Page Configuration
st.set_page_config(page_title="Virtual Try-On", layout="wide")

# 2. Secure API Key Loading
if "GEMINI_API_KEY" in st.secrets:
    genai.configure(api_key=st.secrets["GEMINI_API_KEY"])
else:
    st.error("Missing API Key! Please add 'GEMINI_API_KEY' to your Streamlit Secrets.")
    st.stop()

# 3. Initialize the Model ( Gemini 3.1 Flash Image)
model = genai.GenerativeModel(
    model_name='gemini-3.1-flash-image-preview',
    generation_config={
        "temperature": 0.4, # Lowering this reduces "creative" body changes
        "top_p": 0.9,
    }
)

# --- UI Header ---
st.title("👗Virtual Fitting Room")
st.write("Upload your photo and a garment to see how it looks on you.")

# --- Step 1: User Inputs ---
col1, col2 = st.columns(2)

with col1:
    st.header("Step 1: Your Photo")
    user_file = st.file_uploader("Upload a clear photo of yourself", type=['jpg', 'jpeg', 'png'], key="user")
    if user_file:
        user_img = Image.open(user_file)
        st.image(user_img, caption="Target Person", use_container_width=True)

with col2:
    st.header("Step 2: The Outfit")
    dress_file = st.file_uploader("Upload the dress/outfit image", type=['jpg', 'jpeg', 'png'], key="dress")
    if dress_file:
        dress_img = Image.open(dress_file)
        st.image(dress_img, caption="Desired Outfit", use_container_width=True)

# --- Step 2: Processing Logic ---
st.divider()

if user_file and dress_file:
    if st.button("✨ Generate Virtual Try-On", type="primary", use_container_width=True):
        with st.spinner("Analyzing fit and fabric... This takes about 10-15 seconds."):
            try:
                # Construct the prompt for the model
                prompt = """
                ACT AS: A high-end digital tailor and fashion photographer.
                
                INPUT DATA:
                - Image 1 is the TARGET PERSON.
                - Image 2 is the SOURCE GARMENT.
                
                TASK: 
                Perform a seamless virtual try-on. Render a photo of the TARGET PERSON from Image 1 
                wearing the outfit from Image 2.
                
                STRICT CONSTRAINTS (DO NOT OVERFIT):
                1. BODY FIDELITY: You MUST preserve the exact body shape, height, curves, and proportions 
                   of the person in Image 1. Do not swap their body for a generic model.
                2. IDENTITY PRESERVATION: Keep all facial features, hair, and skin tones 100% identical 
                   to Image 1.
                3. FABRIC PHYSICS: Drap the garment from Image 2 onto the body from Image 1. The fabric 
                   should fold and stretch naturally according to the person's unique pose and anatomy.
                4. LIGHTING: Ensure the lighting on the dress matches the ambient lighting of the 
                   person's original photo.
                
                NEGATIVE PROMPT: 
                Do not alter the person's weight. Do not change the person's face. Do not 
                distort the original body silhouette.
                """
                
                # Send both images and the prompt to Nano Banana
                response = model.generate_content([prompt, user_img, dress_img])
                
                # Display the result
                st.subheader("Result: Your New Look")
                st.image(response.candidates[0].content.parts[0].inline_data.data, use_container_width=True)
                
            except Exception as e:
                st.error(f"An error occurred: {e}")
else:
    st.info("Please upload both images above to enable the 'Generate' button.")
