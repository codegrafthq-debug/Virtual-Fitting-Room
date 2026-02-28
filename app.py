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
st.title("👗Virtual Fitting Room v1.1.2.1")
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
        with st.spinner("Step 1: Stitching your outfit..."):
            try:
                # --- PASS 1: GENERATE IMAGE ---
                gen_prompt = "Generate a high-fidelity virtual try-on of the person in Image 1 wearing the outfit in Image 2. Preserve body shape and facial features."
                response = model.generate_content([gen_prompt, user_img, dress_img])
                
                # Extract the generated image
                result_img_bytes = response.candidates[0].content.parts[0].inline_data.data
                st.image(result_img_bytes, caption="Your New Look", use_container_width=True)
    
                # --- PASS 2: GENERATE STYLIST NOTES ---
                with st.spinner("Step 2: Getting stylist's advice..."):
                    # We feed the RESULT image back to the model for analysis
                    analysis_prompt = """
                    Analyze this photo of a person in their new outfit. 
                    Provide 2-3 sentences of polite, encouraging fashion advice.
                    Focus on how the colors suit their skin tone and how the 
                    fit complements their proportions. Be very supportive.
                    """
                    
                    # We wrap the bytes back into a PIL image for the SDK
                    import io
                    result_pil = Image.open(io.BytesIO(result_img_bytes))
                    
                    analysis_response = model.generate_content([analysis_prompt, result_pil])
                    
                    if analysis_response.text:
                        st.subheader("✨ Stylist's Note")
                        st.info(analysis_response.text)
                    else:
                        st.warning("Stylist notes were unavailable for this generation.")
    
            except Exception as e:
                st.error(f"An error occurred: {e}")
                                  
else:
    st.info("Please upload both images above to enable the 'Generate' button.")
