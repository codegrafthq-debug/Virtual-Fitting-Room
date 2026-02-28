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
st.title("👗Virtual Fitting Room v1.1.2")
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
                # Inside your 'if st.button("Generate Try-On")' block:

                prompt = """
                You are an expert, polite, and encouraging AI Fashion Stylist.
                1. Generate a high-fidelity virtual try-on image where the person from Image 1 
                   is wearing the outfit from Image 2. 
                2. Preserve the person's original body shape, height, and facial features perfectly.
                3. Below the image, provide a brief (2-3 sentence) polite fashion analysis.
                
                Styling Analysis Guidelines:
                - Analyze how the outfit's color interacts with their skin tone.
                - Comment on how the silhouette complements their specific body shape and height.
                - Be supportive and kind. If something doesn't match perfectly, suggest a 
                  small accessory or adjustment (e.g., 'adding a belt' or 'different shoes') 
                  instead of saying it looks 'bad'.
                
                Format your response as follows:
                [IMAGE]
                (The generated image goes here)
                [ANALYSIS]
                (Your polite styling text goes here)
                """
                
                # Optional: Control the length of the stylist's note
                response = model.generate_content(
                    [prompt, user_img, dress_img],
                    generation_config={"max_output_tokens": 1000} # Allows room for image + text
                )
                
                # --- Revised Display Logic ---
                # We specifically look for image data and text data separately
                result_image = None
                stylist_note = ""

                for part in response.candidates[0].content.parts:
                    if hasattr(part, 'inline_data') and part.inline_data:
                        result_image = part.inline_data.data
                    elif hasattr(part, 'text') and part.text:
                        stylist_note += part.text

                # Display the Image if found
                if result_image:
                    st.image(result_image, caption="Your New Look", use_container_width=True)
                else:
                    st.warning("The AI didn't return an image. Try adjusting your prompt.")

                # Display the Stylist's Note if found
                if stylist_note:
                    st.subheader("✨ Stylist's Note")
                    # Cleaning up the [ANALYSIS] tags if the model included them
                    clean_note = stylist_note.replace("[ANALYSIS]", "").strip()
                    st.info(clean_note)
                else:
                    st.warning("The Stylist was shy this time! No notes were generated.")
                                
                    
            except Exception as e:
                st.error(f"An error occurred: {e}")
else:
    st.info("Please upload both images above to enable the 'Generate' button.")
