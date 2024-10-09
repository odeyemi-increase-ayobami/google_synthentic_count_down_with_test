const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

let driver;

describe("Countdown Timer Test Suite", () => {
  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    let url = "http://127.0.0.1:5500/selection_code/index.html";
    await driver.get(url);  
  });

  after(async () => {
    await driver.quit();
  });

  it("should have the timer element present on the page", async () => {
    const timerElement = await driver.findElement(By.id("timer"));
    assert.ok(timerElement, "Timer element should be present on the page.");
  });

  it("should display the timer in the correct format (d h m s)", async () => {
    const timerElement = await driver.findElement(By.id("timer"));
    const timerText = await timerElement.getText();
    assert.match(
      timerText,
      /\d+d \d+h \d+m \d+s/,
      "Timer should display the correct format."
    );
  });

  it("should update the timer every second", async () => {
    const timerElement = await driver.findElement(By.id("timer"));
    const firstText = await timerElement.getText();
    await driver.sleep(1000); 
    const secondText = await timerElement.getText();
    assert.notStrictEqual(
      firstText,
      secondText,
      "Timer should update every 1 second."
    );
  });

  it("should load the timer element within 3 seconds", async () => {
    const timerElement = await driver.findElement(By.id("timer"));
    await driver.wait(
      until.elementIsVisible(timerElement),
      3000,
      "Timer did not load within 3 seconds."
    );
  });

  it("should display EXPIRED! when countdown reaches 0", async () => {
    const timerElement = await driver.findElement(By.id("timer"));
    const targetDate = new Date("January 1, 2025 00:00:00").getTime();
    if (Date.now() > targetDate) {
      const timerText = await timerElement.getText();
      assert.strictEqual(
        timerText,
        "EXPIRED!",
        "Timer should show EXPIRED! after countdown reaches 0."
      );
    }
  });

  it("should stop updating the timer after showing EXPIRED!", async () => {
    const timerElement = await driver.findElement(By.id("timer"));
    if ((await timerElement.getText()) === "EXPIRED!") {
      await driver.sleep(2000); 
      const finalText = await timerElement.getText();
      assert.strictEqual(
        finalText,
        "EXPIRED!",
        "Timer should stop updating after showing EXPIRED!."
      );
    }
  });

  it("should have a white background (#fff) for the timer", async () => {
    const timerElement = await driver.findElement(By.id("timer"));
    const bgColor = await timerElement.getCssValue("background-color");
    assert.strictEqual(
      bgColor,
      "rgba(255, 255, 255, 1)",
      "Timer background color should be white."
    );
  });

  it("should have a font size of 3em", async () => {
    const timerElement = await driver.findElement(By.id("timer"));
    const fontSize = await timerElement.getCssValue("font-size");
    assert.strictEqual(fontSize, "48px", "Font size should be 3em.");
  });

  it("should be centered horizontally and vertically using Flexbox", async () => {
    const bodyElement = await driver.findElement(By.css("body"));
    const bodyDisplay = await bodyElement.getCssValue("display");
    const justifyContent = await bodyElement.getCssValue("justify-content");
    const alignItems = await bodyElement.getCssValue("align-items");

    assert.strictEqual(
      bodyDisplay,
      "flex",
      "Body should use Flexbox for centering."
    );
    assert.strictEqual(
      justifyContent,
      "center",
      "Timer should be horizontally centered."
    );
    assert.strictEqual(
      alignItems,
      "center",
      "Timer should be vertically centered."
    );
  });

  it("should have a page background color of #f0f0f0", async () => {
    const bodyElement = await driver.findElement(By.css("body"));
    const bodyBgColor = await bodyElement.getCssValue("background-color");
    assert.strictEqual(
      bodyBgColor,
      "rgba(240, 240, 240, 1)",
      "Page background color should be #f0f0f0."
    );
  });
});
