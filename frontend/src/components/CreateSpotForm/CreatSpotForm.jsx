export default function CreateSpotForm() {
    function search(formData) {
      const query = formData.get("query");
      alert(`You searched for '${query}'`);
    }
    return (
     
      <form action={search}>
           <h1>Create a New Spot</h1>
           <h2>Where's your place located?</h2>
           <text>Guests will only get your exact address once they boopke a reservation.</text>
           <p>Country</p>
           <input type="text" name="message" placeholder="Country" />
           <p>Adress</p>
           <input type="text" name="message" placeholder="Address" />
           <p>City</p>
           <input type="text" name="message" placeholder="City" />
           <p>State</p>
           <input type="text" name="message" placeholder="STATE" />
           <h2>Describe your place to guests</h2>
           <p>Mention the best features of your space, any special amentities like fast wif or parking, and what you love about the neighborhood.</p>
           <input type="text" name="message" placeholder="Please write at least 30 characters" />
           <h2>Create a title for your spot</h2>
           <p>Catch guests attention with a spot title that highlights what makes your place special.</p>
           <input type="text" name="message" placeholder="Name of spot" />
           <h2>Set a base price for your spot</h2>
           <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
           <input type="text" name="message" placeholder="Price per night" />
           <h2>Liven up your spot with photos</h2>
           <p>Submit a link to at least one photo to publish your spot.</p>
           <input type="text" name="message" placeholder="Preview Image URL" />
           <input type="text" name="message" placeholder="Image URL" />
           <input type="text" name="message" placeholder="Image URL" />
           <input type="text" name="message" placeholder="Image URL" />
           <input type="text" name="message" placeholder="Image URL" />
     
        <button type="submit">Create Spot</button>
      </form>
    );
}
<p></p>
