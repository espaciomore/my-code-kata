import asyncio
from main import app

async def run_app():
    """Run the Flask app with asyncio support"""
    # Configure Flask to work with asyncio
    app.config['ASYNC_MODE'] = True
    
    # Run the app
    app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)

if __name__ == '__main__':
    # loop = asyncio.new_event_loop()
    # asyncio.set_event_loop(loop)
    # loop.create_task(run_app())
    # loop.run_forever()
    
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(run_app())