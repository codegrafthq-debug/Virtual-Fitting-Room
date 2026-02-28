import streamlit as st
import google.generativeai as genai
from PIL import Image
import os

# 1. Page Configuration
st.set_page_config(page_title="Virtual Try-On", layout="wide")

# 2. Secure API Key Loading
# Make sure you've added 'GEMINI_API_KEY' to your Streamlit Cloud Secrets!
if "GEMINI_API_KEY" in st.secrets:
    genai.configure(api_key=st.secrets["GEMINI_API_KEY"])
else:
    st.error("Missing API Key! Please add 'GEMINI_API_KEY' to your Streamlit Secrets.")
    st.stop()

# 3. Initialize the Model (Nano Banana 2 / Gemini 3.1 Flash Image)
model = genai.GenerativeModel('gemini-3.1-flash-image-preview')

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
                Task: Virtual Try-On.
                Inputs: 
                - Image 1: A person.
                - Image 2: A garment/outfit.
                Output: Generate a high-resolution, realistic photo of the person from Image 1 
                wearing the exact outfit from Image 2. 
                Requirements:
                - Maintain the person's facial features, body shape, and pose.
                - Wrap the clothing realistically around the body contours.
                - Match the lighting and shadows of the person's environment.
                - High fidelity, no artifacts.
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
