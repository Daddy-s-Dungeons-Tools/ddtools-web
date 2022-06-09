import { ComponentMeta, ComponentStory } from "@storybook/react";
import { NoteBox } from "../components/NoteBox";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "DDTools/Notes/NoteBox",
  component: NoteBox,
} as ComponentMeta<typeof NoteBox>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof NoteBox> = (args) => (
  <NoteBox {...args} />
);

const onDelete = () => window.alert("Deleted!");

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  note: {
    id: "fakeid",
    ref: null!,
    title: "Note Title",
    body: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ad ipsam quaerat reprehenderit architecto voluptatem. Magnam praesentium voluptatibus explicabo alias repellendus! Aliquid maxime accusantium quidem culpa nisi. Voluptatibus non facere repellendus porro id obcaecati sed exercitationem sapiente quasi placeat vero expedita sit neque, recusandae molestias sunt eaque deleniti aliquid! Fuga eius dicta aspernatur accusamus ipsa neque assumenda veritatis eligendi impedit at aliquid unde optio adipisci fugiat est omnis architecto laudantium quae ratione, cupiditate distinctio! At aspernatur est consectetur iusto voluptatibus in doloribus mollitia ad voluptatum delectus illum ratione blanditiis ullam esse repellendus a, adipisci quisquam explicabo ipsum, rem quidem incidunt impedit illo distinctio? Id dolores at dolorum odit quod illo similique sed fugit, ratione, eos nostrum deleniti. Debitis corporis, fuga tempora praesentium accusantium sed quos incidunt illum veritatis omnis id maxime velit excepturi? Eligendi, sapiente praesentium accusamus cum magni adipisci cumque modi ratione exercitationem dignissimos laboriosam hic eum deleniti dolorem. Nulla esse eos deleniti ea similique explicabo praesentium qui, labore, ipsum veniam quidem corporis ullam dicta, tempore eaque odit nesciunt natus? Accusamus quisquam cupiditate ipsam omnis. Enim, quae, ut alias quaerat totam magnam nostrum atque possimus dolorem, quo debitis sunt! Quos aliquid eaque consequuntur reiciendis doloribus. Voluptates accusamus distinctio asperiores velit.",
    createdAt: new Date(),
    ownerUserId: "fakeuserid",
    sharedWith: [],
    tags: ["lore"],
  },
  isEditable: false,
};

export const NoTitle = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
NoTitle.args = {
  note: {
    id: "fakeid",
    ref: null!,
    body: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ad ipsam quaerat reprehenderit architecto voluptatem. Magnam praesentium voluptatibus explicabo alias repellendus! Aliquid maxime accusantium quidem culpa nisi. Voluptatibus non facere repellendus porro id obcaecati sed exercitationem sapiente quasi placeat vero expedita sit neque, recusandae molestias sunt eaque deleniti aliquid! Fuga eius dicta aspernatur accusamus ipsa neque assumenda veritatis eligendi impedit at aliquid unde optio adipisci fugiat est omnis architecto laudantium quae ratione, cupiditate distinctio! At aspernatur est consectetur iusto voluptatibus in doloribus mollitia ad voluptatum delectus illum ratione blanditiis ullam esse repellendus a, adipisci quisquam explicabo ipsum, rem quidem incidunt impedit illo distinctio? Id dolores at dolorum odit quod illo similique sed fugit, ratione, eos nostrum deleniti. Debitis corporis, fuga tempora praesentium accusantium sed quos incidunt illum veritatis omnis id maxime velit excepturi? Eligendi, sapiente praesentium accusamus cum magni adipisci cumque modi ratione exercitationem dignissimos laboriosam hic eum deleniti dolorem. Nulla esse eos deleniti ea similique explicabo praesentium qui, labore, ipsum veniam quidem corporis ullam dicta, tempore eaque odit nesciunt natus? Accusamus quisquam cupiditate ipsam omnis. Enim, quae, ut alias quaerat totam magnam nostrum atque possimus dolorem, quo debitis sunt! Quos aliquid eaque consequuntur reiciendis doloribus. Voluptates accusamus distinctio asperiores velit.",
    createdAt: new Date(),
    ownerUserId: "fakeuserid",
    sharedWith: [],
  },
  isEditable: false,
};

export const Editable = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Editable.args = {
  note: {
    id: "fakeid",
    ref: null!,
    body: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ad ipsam quaerat reprehenderit architecto voluptatem. Magnam praesentium voluptatibus explicabo alias repellendus! Aliquid maxime accusantium quidem culpa nisi. Voluptatibus non facere repellendus porro id obcaecati sed exercitationem sapiente quasi placeat vero expedita sit neque, recusandae molestias sunt eaque deleniti aliquid! Fuga eius dicta aspernatur accusamus ipsa neque assumenda veritatis eligendi impedit at aliquid unde optio adipisci fugiat est omnis architecto laudantium quae ratione, cupiditate distinctio! At aspernatur est consectetur iusto voluptatibus in doloribus mollitia ad voluptatum delectus illum ratione blanditiis ullam esse repellendus a, adipisci quisquam explicabo ipsum, rem quidem incidunt impedit illo distinctio? Id dolores at dolorum odit quod illo similique sed fugit, ratione, eos nostrum deleniti. Debitis corporis, fuga tempora praesentium accusantium sed quos incidunt illum veritatis omnis id maxime velit excepturi? Eligendi, sapiente praesentium accusamus cum magni adipisci cumque modi ratione exercitationem dignissimos laboriosam hic eum deleniti dolorem. Nulla esse eos deleniti ea similique explicabo praesentium qui, labore, ipsum veniam quidem corporis ullam dicta, tempore eaque odit nesciunt natus? Accusamus quisquam cupiditate ipsam omnis. Enim, quae, ut alias quaerat totam magnam nostrum atque possimus dolorem, quo debitis sunt! Quos aliquid eaque consequuntur reiciendis doloribus. Voluptates accusamus distinctio asperiores velit.",
    createdAt: new Date(),
    ownerUserId: "fakeuserid",
    sharedWith: [],
  },
  isEditable: true,
  onDelete,
};
