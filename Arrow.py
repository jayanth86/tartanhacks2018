import pygame, sys, time

def max(a,b):
    if (a>b):
        return a
    else:
        return b

pygame.init()
pygame.display.set_caption('Keyboard Example')
size = [10, 10]
screen = pygame.display.set_mode(size)
clock = pygame.time.Clock()



counter = 0

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_LEFT:
                counter = max(0, counter-1)
                print(counter)
            if event.key == pygame.K_RIGHT:
                counter += 1
                print(counter)
            if event.key == pygame.K_SPACE:
                counter = 0
                print(counter)

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
