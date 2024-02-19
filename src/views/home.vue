<template>
  <form @submit.prevent="submitForm">
    <label class="input input-bordered flex items-center gap-2">
      <input type="text" v-model="word" class="grow" placeholder="Search" />
      <button type="submit">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="w-4 h-4 opacity-70"
        >
          <path
            fill-rule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </label>
  </form>
  <div v-if="response">
    <h3>Results</h3>
    <ol>
      <li v-if="this.dataArrayNoun.length != 0">
        noun
        <div v-for="data in this.dataArrayNoun">
          <ul>
            <li>{{ data }}<button @click="defTTS(data)">🔊</button></li>
          </ul>
        </div>
      </li>
      <li v-if="this.dataArrayVerb.length != 0">
        verb
        <div v-for="data in this.dataArrayVerb">
          <ul>
            <li>{{ data }}<button @click="defTTS(data)">🔊</button></li>
          </ul>
        </div>
      </li>
    </ol>
  </div>
</template>
<script>
import axios from "axios";
var inputWord = "";
var APIlink = "";
var dataArrayLength = 0;
var APIlinkTts = "";
var bytes;
export default {
  data() {
    return {
      word: "",
      response: "",
      dataArray: [],
      refArray: [],
      dataArrayNoun: [],
      dataArrayVerb: [],
    };
  },
  methods: {
    submitForm() {
      this.dataArray = [];
      this.refArray = [];
      this.dataArrayNoun = [];
      this.dataArrayVerb = [];
      inputWord = this.word;
      APIlink = `https://api.dictionaryapi.dev/api/v2/entries/en/${inputWord}`;
      console.log(inputWord);
      console.log(APIlink);
      axios
        .get(APIlink, {})
        .then((response) => {
          console.log(response);
          this.response = response;
          for (let i = 0; i < this.response.data.length; i++) {
            this.refArray = [];
            this.refArray = this.response.data[i].meanings;
            for (let i = 0; i < this.refArray.length; i++) {
              this.dataArray.push(this.refArray[i]);
            }
          }
          this.refArray = [];
          dataArrayLength = this.dataArray.length;
          for (let i = 0; i < dataArrayLength; i++) {
            if (this.dataArray[i].partOfSpeech === "noun") {
              let arrayElementLength = this.dataArray[i].definitions.length;
              console.log("arrayElementLength :", arrayElementLength);
              this.refArray = this.dataArray[i].definitions;
              // console.log("refArray : ", this.refArray);
              for (let r = 0; r < arrayElementLength; r++) {
                this.dataArrayNoun.push(this.refArray[r].definition);
              }
              this.refArray = [];
            } else {
              let arrayElementLength = this.dataArray[i].definitions.length;
              console.log("arrayElementLength :", arrayElementLength);
              this.refArray = this.dataArray[i].definitions;
              // console.log("refArray : ", this.refArray);
              for (let r = 0; r < arrayElementLength; r++) {
                this.dataArrayVerb.push(this.refArray[r].definition);
              }
              this.refArray = [];
            }
          }
          console.log("dataArrayLength :", dataArrayLength);
          console.log("dataArray : ", this.dataArray);
          console.log("dataArrayNoun : ", this.dataArrayNoun);
          console.log("dataArrayVerb : ", this.dataArrayVerb);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    defTTS(data) {
      const APIKey = "70f421f96b8443f8bf44b25b3717fbab";
      const APIlinkTts = `http://api.voicerss.org/?key=${APIKey}&hl=en-us&b64=true&c=MP3&src=${data}`;

      axios
        .get(APIlinkTts)
        .then((response) => {
          console.log(response);
          const base64AudioData = response.data;
          const decodedAudioData = atob(base64AudioData.split(",")[1]);

          const arrayBuffer = new ArrayBuffer(decodedAudioData.length);
          const uint8Array = new Uint8Array(arrayBuffer);
          for (let i = 0; i < decodedAudioData.length; i++) {
            uint8Array[i] = decodedAudioData.charCodeAt(i);
          }
          const blob = new Blob([uint8Array], { type: "audio/mpeg" });
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio();
          audio.src = audioUrl;
          audio.play();
        })
        .catch((error) => {
          console.error("Error fetching TTS:", error);
        });
    },
  },
};
</script>
<style></style>
