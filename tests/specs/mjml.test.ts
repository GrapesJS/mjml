import grapesjs, { Editor } from "grapesjs";
import grapesJSMJML from "../../src";

// Extracted raw mjml from the index.html file
const rawMjml = `
<mjml><mj-head><mj-font name="Barlow" href="https://fonts.googleapis.com/css?family=Barlow"></mj-font><mj-style>
          .slogan {
            background: #000;
          }
        </mj-style></mj-head><mj-body><!-- Company Header --><mj-section background-color="#f0f0f0"><mj-column border="10px solid #F45E43"><mj-text font-family="Barlow">A first line of text</mj-text><mj-spacer height="50px">
          </mj-spacer></mj-column></mj-section><!-- Image Header --><mj-section background-url="http://1.bp.blogspot.com/-TPrfhxbYpDY/Uh3Refzk02I/AAAAAAAALw8/5sUJ0UUGYuw/s1600/New+York+in+The+1960's+-+70's+(2).jpg" background-size="cover" background-repeat="no-repeat"><mj-column><mj-text css-class="slogan" align="center" color="#fff" font-size="40px" font-family="Helvetica Neue">Slogan here</mj-text><mj-button background-color="#F63A4D" href="#">
              Promotion
            </mj-button></mj-column></mj-section><!-- Intro text --><mj-wrapper background-color="#ffe9f7" padding="10px"><mj-section background-color="#eaeffa"><mj-group background-color="#fffadd"><mj-column><mj-text font-style="italic" font-size="20px" font-family="Helvetica Neue" color="#626262">My Awesome Text</mj-text><mj-text color="#525252">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin rutrum enim eget magna efficitur, eu semper augue semper.
                  Aliquam erat volutpat. Cras id dui lectus. Vestibulum sed finibus lectus, sit amet suscipit nibh. Proin nec
                  commodo purus. Sed eget nulla elit. Nulla aliquet mollis faucibus.
                </mj-text><mj-button background-color="#F45E43" href="#">Learn more</mj-button></mj-column></mj-group></mj-section></mj-wrapper><!-- Side image --><mj-section background-color="white"><mj-column><mj-image width="200px" src="https://designspell.files.wordpress.com/2012/01/sciolino-paris-bw.jpg">
          </mj-image></mj-column><mj-column><mj-text font-style="italic" font-size="20px" font-family="Helvetica Neue" color="#626262">
              Find amazing places ...
            </mj-text><mj-text color="#525252">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin rutrum enim eget magna efficitur, eu semper augue semper.
              Aliquam erat volutpat. Cras id dui lectus. Vestibulum sed finibus lectus.</mj-text></mj-column></mj-section><mj-section><mj-column><mj-text font-style="italic" font-size="20px" font-family="Helvetica Neue" color="#626262" align="center">
              ... with real-life images
            </mj-text></mj-column></mj-section><mj-raw><div class="container"><img src="https://source.unsplash.com/random/200x141?random" alt="Example image" class="item"/><img src="https://source.unsplash.com/random/200x142?random" alt="Example image" class="item"/><img src="https://source.unsplash.com/random/200x143?random" alt="Example image" class="item"/><img src="https://source.unsplash.com/random/200x144?random" alt="Example image" class="item"/><img src="https://source.unsplash.com/random/200x145?random" alt="Example image" class="item"/><img src="https://source.unsplash.com/random/200x146?random" alt="Example image" class="item"/></div></mj-raw><!-- Icons --><mj-section background-color="#fbfbfb"><mj-column><mj-image width="100px" src="http://191n.mj.am/img/191n/3s/x0l.png">
          </mj-image></mj-column><mj-column><mj-image width="100px" src="http://191n.mj.am/img/191n/3s/x01.png">
          </mj-image></mj-column><mj-column><mj-image width="100px" src="http://191n.mj.am/img/191n/3s/x0s.png">
          </mj-image></mj-column></mj-section><!-- Footer --><mj-section background-color="#e7e7e7"><mj-column><mj-button href="#">Hello There!</mj-button><mj-social font-size="15px" icon-size="30px" mode="horizontal"><mj-social-element name="facebook" href="https://mjml.io/">
                Facebook
              </mj-social-element><mj-social-element name="google" href="https://mjml.io/">
                Google
              </mj-social-element><mj-social-element name="twitter" href="https://mjml.io/">
                Twitter
              </mj-social-element></mj-social></mj-column></mj-section><!-- Footer --></mj-body></mjml>`;

const expectedBlocks = [
  "mj-1-column",
  "mj-2-columns",
  "mj-3-columns",
  "mj-text",
  "mj-button",
  "mj-image",
  "mj-divider",
  "mj-social-group",
  "mj-social-element",
  "mj-spacer",
  "mj-navbar",
  "mj-navbar-link",
  "mj-hero",
  "mj-wrapper",
  "mj-raw",
];

describe("mjml tests", () => {
  let editor: Editor;

  beforeEach((done) => {
    const e = grapesjs.init({
      container: "#gjs",
      plugins: [grapesJSMJML],
    });
    editor = e;

    editor.getModel().loadOnStart();
    editor.on("change:readyLoad", () => done());
  });

  afterEach(() => {
    editor.destroy();
  });

  test("Editor exists", () => {
    expect(editor).toBeTruthy();
  });

  test.each(expectedBlocks)("Has block %s", (block) => {
    const blocks = editor.BlockManager.getAll()!;
    const blockExists = blocks.find((b) => b.id === block);
    expect(blockExists).toBeTruthy();
  });

  test("should create basic structure and snapshot result", () => {
    editor.addComponents(rawMjml);

    const { errors, html } = editor.Commands.run("mjml-code-to-html");

    expect(errors).toHaveLength(0);

    expect(html).toMatchSnapshot();
  });
});
