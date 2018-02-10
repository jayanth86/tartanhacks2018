### THIS VERSION WORKS USING PYGAMES ###

# import pygame, sys, time

# def max(a,b):
#     if (a>b):
#         return a
#     else:
#         return b

# pygame.init()
# pygame.display.set_caption('Keyboard Example')
# size = [10, 10]
# screen = pygame.display.set_mode(size)
# clock = pygame.time.Clock()



# counter = 0

# while True:
#     for event in pygame.event.get():
#         if event.type == pygame.QUIT:
#             pygame.quit()
#             sys.exit()

#         if event.type == pygame.KEYDOWN:
#             if event.key == pygame.K_LEFT:
#                 counter = max(0, counter-1)
#                 print(counter)
#             if event.key == pygame.K_RIGHT:
#                 counter += 1
#                 print(counter)
#             if event.key == pygame.K_SPACE:
#                 counter = 0
#                 print(counter)

### THIS VERSION WORKS FOR WINDOWS, SUPPOSEDLY UNRELIABLE ###

# import pyHook
# import pythoncom

# def onclick(event):
#     print (event.Position)
#     return True

# hm = pyHook.HookManager()
# hm.SubscribeMouseAllButtonsDown(onclick)
# hm.HookMouse()
# pythoncom.PumpMessages()
# hm.UnhookMouse()


### THIS VERSION IS UNTESTED BECAUSE I CANT GET PYMOUSE ###
### ALSO ASSUMES ONLY CLICKING? ###

# from pymouse import PyMouseEvent

# def fibo():
#     a = 0
#     yield a
#     b = 1
#     yield b
#     while True:
#         a, b = b, a+b
#         yield b

# class Clickonacci(PyMouseEvent):
#     def __init__(self):
#         PyMouseEvent.__init__(self)
#         self.fibo = fibo()

#     def click(self, x, y, button, press):
#         '''Print Fibonacci numbers when the left click is pressed.'''
#         if button == 1:
#             if press:
#                 print(self.fibo.next())
#         else:  # Exit if any other mouse button used
#             self.stop()

# C = Clickonacci()
# C.run()
